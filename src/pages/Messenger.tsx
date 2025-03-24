import React, { useEffect, useRef } from 'react';
import { initializeWebSocket, disconnectWebSocket, messageHandlers } from '../services/WebSocketService';
import { useUser } from '../context/UserContext';
import { useMessenger } from '../context/MessengerContext';
import { ChatInterface, MessageInterface } from '../types';
import Header from '../components/Header';
import { getOpponentNickname } from '../utils/functions';
import Body from '../components/Body';
import Profile from '../components/Profile';
import { useLocation } from 'react-router-dom';
import { MessengerAPI } from '../api/MessengerAPI';
import { BASE_URL } from '../config';


const Messenger: React.FC = () => {
  const location = useLocation();
  const { invitationCode } = location.state || {};
  const { user } = useUser();
  const { chats, setChats, setMessages, currentChat, setCurrentChat, messages } = useMessenger();
  const chatsRef = useRef<ChatInterface[]>([]);
  const messagesRef = useRef<MessageInterface[]>([])
  const currentChatRef = useRef<ChatInterface>()

  function handleChatsChange(chats: ChatInterface[]) {
    setChats(chats);
  }

  useEffect(() => {
    if (currentChat) {
      currentChatRef.current = currentChat
    }
    chatsRef.current = chats;
  }, [chats, currentChat]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const client = initializeWebSocket(
      BASE_URL,
      handleSocketUpdate,
      user?.nickname || '',
      () => handleInvite()
    );

    function handleInvite() {
      if (!user || !invitationCode) return;
      MessengerAPI.sendChatRequest(
        { requestedNickname: invitationCode, requesterPublicKey: user.publicKey },
        user?.jwt
      );
    }

    return () => disconnectWebSocket(client);
  }, [user]);

  const handleSocketUpdate = async (wsMessage: any) => {
    if (!user) return
    let isMessageInCurrentChat = false
    if (wsMessage.data && currentChatRef.current && wsMessage.data.sender !== user.nickname) {
      isMessageInCurrentChat  = currentChatRef.current.requesterNickname == wsMessage.data.sender || currentChatRef.current.requestedNickname == wsMessage.data.sender
    }
    console.log(wsMessage);
    if (wsMessage.type == "request") {
      messageHandlers.request(user, setChats, setCurrentChat);
    }
    if (wsMessage.type == "file") {
      if (wsMessage.data.sender !== user.nickname) {
        MessengerAPI.confirmThatMessageReached(wsMessage.data.id, wsMessage.data.sender, user?.jwt, isMessageInCurrentChat)
      }      messageHandlers.file(wsMessage, setMessages);
    }
    if (wsMessage.type == "message") {
      if (wsMessage.data.sender !== user.nickname) {
        MessengerAPI.confirmThatMessageReached(wsMessage.data.id, wsMessage.data.sender, user?.jwt, isMessageInCurrentChat)
      }

      messageHandlers.message(wsMessage, chatsRef, setMessages, user);
    }
    if (wsMessage.type == 'media') {
      if (wsMessage.data.sender !== user.nickname) {
        MessengerAPI.confirmThatMessageReached(wsMessage.data.id, wsMessage.data.sender, user?.jwt, isMessageInCurrentChat)
      }
      messageHandlers.media(wsMessage, chatsRef, setMessages, user);
    }
    if (wsMessage.data && wsMessage.data.type == 'delete-chat') {
      messageHandlers.delete(wsMessage, chatsRef, handleChatsChange, currentChatRef, setCurrentChat);
    }
    if (wsMessage.data && wsMessage.data.type == 'clear-chat') {
      // messageHandlers.clear(wsMessage, chatsRef, setChats, setCurrentChat);

    }
    if (wsMessage.data && wsMessage.data.type == 'timer') {
      messageHandlers.timer(wsMessage, chatsRef, setMessages, setChats, user, setCurrentChat);
    }
    if (wsMessage.data && wsMessage.type == 'reached') {
      messageHandlers.reached(wsMessage.data, messagesRef, setMessages);
    }
    if (wsMessage.data && wsMessage.type == 'watched') {
      messageHandlers.watched(wsMessage.data, messagesRef, setMessages);
    }
    if (wsMessage.data && wsMessage.data.expiresAt) {
      scheduleMessageDeletion(wsMessage.data.id, wsMessage.data.expiresAt);
    }
    wsMessage.data && messageHandlers.notify(wsMessage, chatsRef, setChats, user, currentChatRef.current)
  };

  const scheduleMessageDeletion = (messageId: string, expiresAt: number) => {
    const timeUntilDeletion = expiresAt - Date.now();

    if (timeUntilDeletion > 0) {
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
        console.log(`Message with ID ${messageId} has been deleted.`);
      }, timeUntilDeletion);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header
        userNickname={user?.nickname}
        chatNickname={currentChat ? getOpponentNickname(user, currentChat) : 'No chat selected'}
      />
      <Body />
      <Profile />
    </div>
  );
};

export default Messenger;
