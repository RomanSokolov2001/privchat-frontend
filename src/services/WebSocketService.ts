import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { MessengerAPI } from '../api/MessengerAPI';
import { getOpponentPublicKey } from '../utils/functions';
import DiffieHellmanService from './DiffieHellmanService';
import { ChatInterface } from '../types';
import { FileSharingAPI } from '../api/FileSharingAPI';


export const initializeWebSocket = (url: string, onMessageReceived: (msg: any) => void, nickname: string, callback?: () => void) => {
  const socket = new SockJS(`http://${url}:8080/ws`);
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
  async request (user: any, setChats: any, setCurrentChat: any) {
    const fetchedChats = await MessengerAPI.getChats(user.publicKey, user.jwt);
    
    if (!fetchedChats) return
    const updatedChats = fetchedChats.map((chat: ChatInterface) => {
      if (user.invitationLink == chat.requestedNickname) {
        console.log('set')
        setCurrentChat(chat)
      }
      const otherPartyKey = getOpponentPublicKey(user, chat);
      const sharedKey = DiffieHellmanService.generateSharedSecret(otherPartyKey, user.secretKey);
      return { ...chat, sharedSecretKey: sharedKey || '' };
    });
    setChats(updatedChats);
  },
  async file (setMessages: any, wsMessage: any) {
    setMessages((prev: any) => [
      ...prev,
      {
        fileEntry: wsMessage.data,
        sender: wsMessage.data.sender,
        receiver: wsMessage.data.receiver,
        createdAt: String(wsMessage.data.createdAt),
        id: wsMessage.data.id
      },
    ]);
  },
  async message(wsMessage: any, chatsRef: any, setMessages: any) {
    const { sender, content: encryptedContent, receiver } = wsMessage.data || {};
    if (!sender || !encryptedContent) return;

    const chat = chatsRef.current.find(
      (chat: any) => chat.requesterNickname === sender || chat.requestedNickname === sender
    );

    const sharedKey = chat?.sharedSecretKey;

    const decryptedContent = DiffieHellmanService.decrypt(encryptedContent, String(sharedKey));
    if (!decryptedContent) return;

    setMessages((prev: any) => [
      ...prev,
      {
        content: decryptedContent,
        sender: sender,
        receiver: receiver,
        time: String(new Date()),
      },
    ]);
  },
  async media(wsMessage: any, chatsRef: any, setMessages: any, user: any) {
    const chat = chatsRef.current.find(
      (chat: any) => chat.requesterNickname === wsMessage.data.sender || chat.requestedNickname === wsMessage.data.sender
    );

    const sharedKey = chat?.sharedSecretKey;

    const file = await FileSharingAPI.downloadEncryptedMedia(wsMessage.data.originalFilename, sharedKey, user?.jwt, wsMessage.data.fileType)
    
    const imageURL = URL.createObjectURL(file)
    setMessages((prevMessages: any) => {
      return [
        ...prevMessages,
        {
          randomId: wsMessage.data.randomId,
          content: "",
          sender: wsMessage.data.sender,
          receiver: wsMessage.data.receiver,
          time: String(new Date()),
          imageURLS: [imageURL],
        },
      ];
    });
  }
}