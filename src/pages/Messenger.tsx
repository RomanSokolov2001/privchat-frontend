import React, { useEffect, useRef, useState } from 'react';
import { MessengerService } from '../api/MessengerService';
import DiffieHellmanService from '../api/DiffieHellmanService';
import { initializeWebSocket, disconnectWebSocket } from '../services/WebSocketService';

import { useUser } from '../context/UserContext';
import { useMessenger } from '../context/MessengerContext';
import { ChatInterface } from '../types';
import { BACKEND_API } from '../config';

import Header from '../components/Header';
import LeftBar from '../components/LeftBar';
import Chat from '../components/Chat';
import { getOpponentNickname, getOpponentPublicKey } from '../utils/functions';
import Body from '../components/Body';


const Messenger: React.FC = () => {
  const { user } = useUser();
  const { chats, setChats, messages, setMessages, currentChat, setCurrentChat, isMobile, showSidebar } = useMessenger();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const chatsRef = useRef<ChatInterface[]>([]);


  useEffect(() => {
    loadChats();
  }, [user, refreshTrigger]);

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

  const handleSocketUpdate = (wsMessage: any) => {
    if (wsMessage.message == "request") {
      loadChats();
      return
    }
    const { sender, content: encryptedContent } = wsMessage.message || {};
    if (!sender || !encryptedContent) return;

    const chat = chatsRef.current.find(
      (chat) => chat.requesterNickname === sender || chat.requestedNickname === sender
    );

    const sharedKey = chat?.sharedSecretKey;
    if (!sharedKey || !user) return;  

    const decryptedContent =  DiffieHellmanService.decrypt(encryptedContent, String(sharedKey));
    if (!decryptedContent) return;

    setMessages((prev) => [
      ...prev,
      {
        content: decryptedContent,
        sender,
        receiver: user.nickname,
        createdAt: new Date(),
      },
    ]);
  };

  const handleChatSelect = (chat: ChatInterface) => {
    setCurrentChat({ ...chat });
  };

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        userNickname={user?.nickname}
        chatNickname={currentChat ? getOpponentNickname(user, currentChat) : 'No chat selected'}
      />
     <Body/>
    </div>
  );
};

export default Messenger;
{/* <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
<Header
  userNickname={user?.nickname}
  chatNickname={currentChat ? getOpponentNickname(user, currentChat) : 'No chat selected'}
/>
<div style={{ display: 'flex', flex: 1 }}>
  <LeftBar onChatSelect={handleChatSelect} trigger={refreshTrigger} />
  {currentChat ? <Chat trigger={refreshTrigger} /> : <div>Select a chat to start messaging</div>}
</div>
<button onClick={() => setRefreshTrigger(refreshTrigger + 1)}>Refresh</button>
</div> */}