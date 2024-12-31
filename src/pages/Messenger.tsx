import React, { useEffect, useRef } from 'react';
import { initializeWebSocket, disconnectWebSocket, messageHandlers } from '../services/WebSocketService';

import { useUser } from '../context/UserContext';
import { useMessenger } from '../context/MessengerContext';
import { ChatInterface } from '../types';
import { BACKEND_API } from '../config';

import Header from '../components/Header';
import { getOpponentNickname } from '../utils/functions';
import Body from '../components/Body';
import Profile from '../components/Profile';
import { useLocation } from 'react-router-dom';
import { MessengerAPI } from '../api/MessengerAPI';


const Messenger: React.FC = () => {
  const location = useLocation()
  const { invitationCode } = location.state || {}
  const { user } = useUser();
  const { chats, setChats, setMessages, currentChat, setCurrentChat} = useMessenger();
  const chatsRef = useRef<ChatInterface[]>([]);


  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const client = initializeWebSocket(
      BACKEND_API,
      handleSocketUpdate,
      user?.nickname || '',
      ()=> handleInvite()
    );

    function handleInvite() {
      if (!user || !invitationCode) return
      console.log('start')

      MessengerAPI.sendChatRequest({ requestedNickname: invitationCode, requesterPublicKey: user.publicKey }, user?.jwt)
    }
    return () => disconnectWebSocket(client);
  }, [user]);


  const handleSocketUpdate = async (wsMessage: any) => {
    if (wsMessage.type == "request") {
      messageHandlers.request(user, setChats, setCurrentChat)
    }
    if (wsMessage.type == "file") {
      messageHandlers.file(setMessages, setMessages)
    }
    if (wsMessage.type == "message") {
     messageHandlers.message(wsMessage, chatsRef, setMessages)
    }
    if (wsMessage.type == 'media') {
      messageHandlers.media(wsMessage, chatsRef, setMessages, user)
    }
  };

  return (
    <div className='flex flex-col h-screen w-screen'>
      <Header
        userNickname={user?.nickname}
        chatNickname={currentChat ? getOpponentNickname(user, currentChat) : 'No chat selected'}
      />
      <Body />
      <Profile/> 
    </div>
  );
};

export default Messenger;