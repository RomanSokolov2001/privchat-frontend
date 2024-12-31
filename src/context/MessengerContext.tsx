import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatInterface, MessageInterface } from '../types';


interface MessengerContextType {
  messages: MessageInterface[];
  setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>;
  chats: ChatInterface[];
  setChats: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
  currentChat: ChatInterface | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<ChatInterface | null>>;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  screenSize: {width: number, height: number};
  chatWidth: number;
  areTermsAccepted: boolean;
  setTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  expiredFiles: String[];
  setExpiredFiles: React.Dispatch<React.SetStateAction<String[]>>;
  showSetTimerWindow: boolean;
  setShowSetTimerWindow: React.Dispatch<React.SetStateAction<boolean>>;
}


const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

interface MessengerProviderProps {
  children: ReactNode;
}

export const MessengerProvider: React.FC<MessengerProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [chats, setChats] = useState<ChatInterface[]>([])
  const [currentChat, setCurrentChat] = useState<ChatInterface | null>(null);
  const [showSidebar, setShowSidebar] = useState<any>(null)
  const [showProfile, setShowProfile] = useState<any>(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showSetTimerWindow, setShowSetTimerWindow] = useState(false)
  const [areTermsAccepted, setTermsAccepted] = useState(false)
  const [chatWidth, setChatWidth] = useState<number>(isMobile ? window.innerWidth : window.innerWidth - 250)
  const [expiredFiles, setExpiredFiles] = useState<String[]>([])


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setChatWidth(isMobile ? window.innerWidth : window.innerWidth - 250); 
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <MessengerContext.Provider value={{ messages, setMessages, chats, setChats, currentChat, setCurrentChat, showSidebar, setShowSidebar, showProfile, setShowProfile, isMobile, setIsMobile, screenSize, chatWidth, areTermsAccepted, setTermsAccepted, expiredFiles, setExpiredFiles, showSetTimerWindow, setShowSetTimerWindow}}>
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
