import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatInterface, Message } from '../types';


interface MessengerContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chats: ChatInterface[];
  setChats: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
  currentChat: ChatInterface | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<ChatInterface | null>>;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
}


const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

interface MessengerProviderProps {
  children: ReactNode;
}

export const MessengerProvider: React.FC<MessengerProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<ChatInterface[]>([])
  const [currentChat, setCurrentChat] = useState<ChatInterface | null>(null);
  const [showSidebar, setShowSidebar] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <MessengerContext.Provider value={{ messages, setMessages, chats, setChats, currentChat, setCurrentChat, showSidebar, setShowSidebar, isMobile, setIsMobile }}>
      {children}
    </MessengerContext.Provider >
  );
};

export const useMessenger = (): MessengerContextType => {
  const context = useContext(MessengerContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
