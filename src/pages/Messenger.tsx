import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { initializeWebSocket, disconnectWebSocket } from '../services/WebSocketService';
import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {
  addMessage, addUnreadToChat, clearChatById, deleteChatById,
  setChats,
  setCurrentChat,
  setMessages,
  updateChatById,
  updateMessageById
} from '../redux/messengerSlice';

import { ChatInterface, MessageInterface } from '../utils/types';

import Header from '../UI/Header';
import Body from '../UI/Body';
import Profile from '../UI/modals/Profile';


const Messenger: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const messages = useSelector((state: RootState) => state.messenger.messages);
  const currentChat = useSelector((state: RootState) => state.messenger.currentChat);
  const chats = useSelector((state: RootState) => state.messenger.chats);

  const dispatch = useDispatch();

  const chatsRef = useRef<ChatInterface[]>([]);
  const messagesRef = useRef<MessageInterface[]>([])
  const currentChatRef = useRef<ChatInterface>()

  function handleDeleteChat(chatId: string) {
    dispatch(deleteChatById(chatId));
  }

  function handleClearChat(chatId: string) {
    dispatch(clearChatById({chatId, senderNickname: user?.nickname}));
  }

  function changeMessages(messages: MessageInterface[]) {
    dispatch(setMessages(messages));
  }
  function changeCurrentChat(chat: ChatInterface) {
    dispatch(setCurrentChat(chat));
  }

  function handleChatsChange(chats: ChatInterface[]) {
    dispatch(setChats(chats));
  }

  function handleAddMessage(msg: MessageInterface) {
    dispatch(addMessage(msg))
  }

  function handleUpdateChat(chat: any) {
    dispatch(updateChatById(chat));
  }

  function handleUpdateMessage(message: any) {
    dispatch(updateMessageById(message));
  }

  function handleAddUnreadToChat(chatId: string) {
    dispatch(addUnreadToChat(chatId));
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
        currentChatRef, chatsRef, messagesRef, user, handleChatsChange, changeCurrentChat, changeMessages, handleAddMessage, handleUpdateChat, handleUpdateMessage, handleAddUnreadToChat, handleDeleteChat, handleClearChat
    );
    return () => disconnectWebSocket(client);
  }, [user]);


  return (
    <div className="flex flex-col h-screen w-screen">
      <Header/>
      <Body />
      <Profile />
    </div>
  );
};

export default Messenger;
