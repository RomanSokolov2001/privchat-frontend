import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { MessengerAPI } from '../api/MessengerAPI';
import { getOpponentNickname, getOpponentPublicKey } from '../utils/functions';
import DiffieHellmanService from './DiffieHellmanService';
import { ChatInterface, MessageInterface } from '../types';
import { FileSharingAPI } from '../api/FileSharingAPI';
import { BASE_URL } from '../config';
import {Dispatch, MutableRefObject, SetStateAction} from "react";


export const initializeWebSocket = (url: string, onMessageReceived: (msg: any) => void, nickname: string, callback?: () => void) => {
  // export const BASE_URL = `http://16.171.154.134/api`
  const socket = new SockJS(`${BASE_URL}/ws`);
  const client = Stomp.over(socket);

  client.connect({}, () => {
    const sessionUrl = client.ws._transport.url;
    const sessionId = extractSessionId(sessionUrl);

    const subscription = client.subscribe(`/queue/specific-user-${sessionId}`, (msg) => {
      onMessageReceived(JSON.parse(msg.body));
    });

    if (subscription) {
      client.send('/app/chat.addUser', {}, nickname);

      if (callback) {
        callback();
      }
    }
  },
  (error: any) => {
    console.error('STOMP connection error:', error);
  });

  return client;
};

export const disconnectWebSocket = (client: any) => {
  if (client) {
    client.disconnect();
  }
};

const extractSessionId = (sessionUrl: string): string => {
  const parts = sessionUrl.split('/');
  return `${parts[parts.length - 2]}`;
};

export const messageHandlers = {
  delete(wsMessage: any, chatsRef: MutableRefObject<ChatInterface[]>, handleChatsChange: (chats: ChatInterface[]) => void, currentChatRef: MutableRefObject<ChatInterface | undefined> , setCurrentChat: Dispatch<SetStateAction<ChatInterface | null>>) {

    console.log(wsMessage.data.chatId);
    const updatedChats = chatsRef.current.map((chat: ChatInterface) => {
      if (chat.chatId !== wsMessage.data.chatId) {
        console.log('LOOLOLOLOL')
        return {...chat}
      };
      return {}
    });
    if (currentChatRef.current && (currentChatRef.current.chatId === wsMessage.data.chatId)) {
      currentChatRef.current = undefined;
      setCurrentChat(null)
    }
    // @ts-ignore
    chatsRef.current = updatedChats;
    // @ts-ignore
    handleChatsChange(updatedChats);
    console.log(chatsRef.current);

  },
  clear(wsMessage: any, chatsRef: MutableRefObject<ChatInterface[]>, setChats: Dispatch<SetStateAction<ChatInterface[]>>, setCurrentChat: Dispatch<SetStateAction<ChatInterface | null>>) {
    console.log('Success have to clear')
  },
  async request (user: any, setChats: any, setCurrentChat: any) {
    const fetchedChats = await MessengerAPI.getChats(user.publicKey, user.jwt);

    if (!fetchedChats) return
    const updatedChats = fetchedChats.map((chat: ChatInterface) => {
      if (user.invitationLink == chat.requestedNickname) {
        setCurrentChat(chat)
      }
      const otherPartyKey = getOpponentPublicKey(user, chat);
      const sharedKey = DiffieHellmanService.generateSharedSecret(otherPartyKey, user.secretKey);
      return { ...chat, sharedSecretKey: sharedKey || '' };
    });
    console.log(updatedChats);
    setChats(updatedChats);
  },
  async file (wsMessage: any, setMessages: any) {
    setMessages((prev: any) => [
      ...prev,
      {
        fileEntry: wsMessage.data,
        sender: wsMessage.data.sender,
        receiver: wsMessage.data.receiver,
        createdAt: String(new Date()),
        id: wsMessage.data.id
      },
    ]);
  },
  async message(wsMessage: any, chatsRef: any, setMessages: any, user: any) {
    const { sender, content: encryptedContent, receiver, id } = wsMessage.data || {};
    if (!sender || !encryptedContent) return;

    var opponentNickname = ''
    if (sender == user.nickname) {
      opponentNickname = receiver
    } else {
      opponentNickname = sender
    }

    const chat = chatsRef.current.find(
      (chat: any) => chat.requesterNickname === opponentNickname || chat.requestedNickname === opponentNickname
    );


    const sharedKey = chat?.sharedSecretKey;
    console.log("that key"+ sharedKey)
    const decryptedContent = DiffieHellmanService.decrypt(encryptedContent, String(sharedKey));
    if (!decryptedContent) {
      console.log("Could decrypt content")
      return
    };

    setMessages((prev: any) => [
      ...prev,
      {
        content: decryptedContent,
        sender: sender,
        receiver: receiver,
        createdAt: String(new Date()),
        id
      },
    ]);
  },
  async media(wsMessage: any, chatsRef: any, setMessages: any, user: any) {
    const chat = chatsRef.current.find(
      (chat: any) => chat.requesterNickname === wsMessage.data.sender || chat.requestedNickname === wsMessage.data.sender
    );

    const sharedKey = chat?.sharedSecretKey;

    const file = await FileSharingAPI.downloadEncryptedMedia(wsMessage.data.filename, sharedKey, user?.jwt, wsMessage.data.fileType)

    const imageURL = URL.createObjectURL(file)
    setMessages((prevMessages: any) => {
      return [
        ...prevMessages,
        {
          content: "",
          sender: wsMessage.data.sender,
          receiver: wsMessage.data.receiver,
          createdAt: String(new Date()),
          imageURL: imageURL,
          id: wsMessage.data.id
        },
      ];
    });
  },
  async timer(wsMessage: any, chatsRef: any, setMessages: any, setChats: any, user: any, setCurrentChat: any) {
    const { sender, content: content, receiver } = wsMessage.data || {};
    if (!sender || !content) return;

    const chat = chatsRef.current.find(
      (chat: any) => chat.requesterNickname === wsMessage.data.sender || chat.requestedNickname === wsMessage.data.sender
    );

    const updatedChats = chatsRef.current.map((chat: ChatInterface) => {
      if (sender == getOpponentNickname(user, chat) || receiver == getOpponentNickname(user, chat)) {
        return { ...chat, timer: content };
      } else return {... chat}
    });
    setChats(updatedChats);
    setCurrentChat((prev: ChatInterface) => {
      if (chat && (prev.sharedSecretKey === chat.sharedSecretKey)) {
        return { ...prev, timer: content };
      } else {
        return prev;
      }
    });
    setMessages((prev: any) => [
      ...prev,
      {
        content: content,
        sender: sender,
        receiver: receiver,
        createdAt: String(new Date()),
        type: 'timer',
        id: wsMessage.data.id
      },
    ]);
  },
  reached(messageId: string, messagesRef: React.MutableRefObject<MessageInterface[]>, setMessages: any) {
    if (Array.isArray(messagesRef.current)) {
        const updatedMessages = messagesRef.current.map((msg) =>
            msg.id === messageId ? { ...msg, isReceived: true } : msg
        );
        setMessages(updatedMessages);
        console.log(updatedMessages)
    } else {
        console.error("messagesRef.current is not an array in 'reached':", messagesRef.current);
    }
},

watched(messageId: string, messagesRef: React.MutableRefObject<MessageInterface[]>, setMessages: any) {
    if (Array.isArray(messagesRef.current)) {
        const updatedMessages = messagesRef.current.map((msg) =>
            msg.id === messageId ? { ...msg, isWatched: true } : msg
        );
        setMessages(updatedMessages);
    } else {
        console.error("messagesRef.current is not an array in 'watched':", messagesRef.current);
    }
},
  async notify(
    wsMessage: any,
    chatsRef: React.MutableRefObject<ChatInterface[]>,
    setChats: (chats: ChatInterface[]) => void,
    user: any,
    currentChat?: ChatInterface | null,
  ): Promise<void> {
    // Find the chat where the message sender matches either requester or requested
    const chat = chatsRef.current.find(
      (chat) =>
        chat.requesterNickname === wsMessage.data.sender ||
        chat.requestedNickname === wsMessage.data.sender
    );

    const updatedChats = chatsRef.current.map((ch) => {
      // Check if this chat is currently open
      const isThisCurrentChat = currentChat
        ? ch.sharedSecretKey === currentChat.sharedSecretKey
        : false;
      // Only increment unreads if this is the matching chat AND it's not currently open
      if (chat &&
          ch.sharedSecretKey === chat.sharedSecretKey &&
          !(wsMessage.data.sender === user.nickname) &&
          !isThisCurrentChat) {
        const currentUnreads = ch.unreads || 0;
        return {
          ...ch,
          unreads: currentUnreads + 1
        };
      }

      return ch;
    });

    setChats(updatedChats);
  }
}

