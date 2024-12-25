import React, { useEffect, useRef, useState } from 'react';
import { MessengerService } from '../api/MessengerService';
import DiffieHellmanService from '../api/DiffieHellmanService';
import { initializeWebSocket, disconnectWebSocket } from '../services/WebSocketService';

import { useUser } from '../context/UserContext';
import { useMessenger } from '../context/MessengerContext';
import { ChatInterface, FileEntry } from '../types';
import { BACKEND_API } from '../config';

import Header from '../components/Header';
import { getOpponentNickname, getOpponentPublicKey } from '../utils/functions';
import Body from '../components/Body';


const Messenger: React.FC = () => {
  const { user } = useUser();
  const { chats, setChats, messages, setMessages, currentChat, setCurrentChat, isMobile, showSidebar } = useMessenger();
  const chatsRef = useRef<ChatInterface[]>([]);


  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const client = initializeWebSocket(
      BACKEND_API,
      handleSocketUpdate,
      user?.nickname || ''
    );

    return () => disconnectWebSocket(client);
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    const fetchedChats = await MessengerService.getChats(user.publicKey, user.jwt);
    if (!fetchedChats) return
    const updatedChats = fetchedChats.map((chat: ChatInterface) => {
      const otherPartyKey = getOpponentPublicKey(user, chat);
      const sharedKey = DiffieHellmanService.generateSharedSecret(otherPartyKey, user.secretKey);
      return { ...chat, sharedSecretKey: sharedKey || '' };
    });
    setChats(updatedChats);
  };

  const handleSocketUpdate = async (wsMessage: any) => {
    if (wsMessage.type == "request") {
      loadChats();
      return
    }
    if (wsMessage.type == "file") {
      const data: FileEntry = wsMessage.data
      setMessages((prev) => [
        ...prev,
        {
          fileEntry: data,
          sender: data.sender,
          receiver: data.receiver,
          time: String(new Date()),
        },
      ]);
    }
    if (wsMessage.type == "message") {
      const { sender, content: encryptedContent, receiver } = wsMessage.data || {};
      if (!sender || !encryptedContent) return;

      const chat = chatsRef.current.find(
        (chat) => chat.requesterNickname === sender || chat.requestedNickname === sender
      );

      const sharedKey = chat?.sharedSecretKey;
      if (!sharedKey || !user) return;

      const decryptedContent = DiffieHellmanService.decrypt(encryptedContent, String(sharedKey));
      if (!decryptedContent) return;
      console.log('should be saved')
      setMessages((prev) => [
        ...prev,
        {
          content: decryptedContent,
          sender: sender,
          receiver: receiver,
          time: String(new Date()),
        },
      ]);
    }
    if (wsMessage.type == 'media') {
      const chat = chatsRef.current.find(
        (chat) => chat.requesterNickname === wsMessage.data.sender || chat.requestedNickname === wsMessage.data.sender
      );

      const sharedKey = chat?.sharedSecretKey;
      if (!sharedKey || !user) return;

      const file = await MessengerService.downloadEncryptedMedia(wsMessage.data.originalFilename, sharedKey, user?.jwt, wsMessage.data.fileType)
      

      const imageURL = URL.createObjectURL(file)
      setMessages((prevMessages) => {
        const existingMessageIndex = prevMessages.findIndex(
          (msg) => msg.randomId && (msg.randomId === wsMessage.data.randomId)
        );
    
        if (existingMessageIndex !== -1) {
          console.log('Existing msg')

          const updatedMessages = [...prevMessages];
          const existingMessage = updatedMessages[existingMessageIndex];

          updatedMessages[existingMessageIndex] = {
            ...existingMessage,
            imageURLS: [...(existingMessage.imageURLS || []), imageURL],
          };
          return updatedMessages;
        } else {
          console.log('New msg')
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
        }
      });
    }

  };

  return (
    <div className='flex flex-col h-screen w-screen'>
      <Header
        userNickname={user?.nickname}
        chatNickname={currentChat ? getOpponentNickname(user, currentChat) : 'No chat selected'}
      />
      <Body />
    </div>
  );
};

export default Messenger;