import React, {useEffect, useRef, useState} from 'react';
import { animated, useSpring } from '@react-spring/web';
import { MessengerAPI } from '../api/MessengerAPI';
import { useUser } from '../context/UserContext';
import { ChatInterface } from '../types';
import { useMessenger } from '../context/MessengerContext';
import { getOpponentNickname } from '../utils/functions';
import SearchBar from './animated/searchBar/SearchBar';
import ChatBlock from './animated/chatBlock/ChatBlock';

const LeftBar: React.FC = () => {
  const { user } = useUser();
  const { chats, setChats, setCurrentChat, isMobile, screenSize, showSidebar } = useMessenger();
  const chatsRef = useRef<ChatInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showedChats, setShowedChats] = useState<ChatInterface[]>([]);

  const [springs, api] = useSpring(() => ({
    x: -250,
    config: { tension: 300, friction: 30 },
  }));

  // Update chats display when chats change
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats, setChats]);

  // Handle sidebar animation based on screen size
  useEffect(() => {
    if (isMobile) {
      api.start({ x: showSidebar ? 0 : -250 });
    } else {
      api.set({ x: 0 }); // Reset to default on larger screens
    }
  }, [isMobile, showSidebar, api]);

  function handleClick (chat: ChatInterface) {
    const updatedChats = chatsRef.current.map((ch) => {
      if (chat.sharedSecretKey == ch.sharedSecretKey) {
        return {...ch, unreads: 0}
      } else return ch
    })
    setChats(updatedChats)
    setCurrentChat(chat)
  }

  // Render list of chats
  const renderChats = () => {
    return chatsRef.current.map((chat: ChatInterface) => (
        <ChatBlock nickname={getOpponentNickname(user, chat)} onClick={() => handleClick(chat)} unreads={chat.unreads}/>
    ));
  };

  return (
    <div
      className={`${isMobile && showSidebar ? 'absolute w-full bg-[rgba(0,0,0,0.5)]' : ''}`}
      style={{ zIndex: 999, height: `${screenSize.height - 80}px`,}}
    >
      <animated.div
        className={`w-[250px] p-2 border-r border-gray-300 flex flex-col items-center bg-white shadow-xl z-500 ${
          isMobile ? 'absolute h-full' : 'h-full left-[10px]'
        }`}
        style={{
          maxHeight: `${screenSize.height - 80}px`,
          height: `${screenSize.height - 80}px`,
          ...springs,
        }}
      >
        {/* Search Bar */}
        <SearchBar />

        {/* Chat List */}
        <div className="w-full overflow-auto">
          {chatsRef.current.length > 0 ? (
            <ul>{renderChats()}</ul>
          ) : (
            <p className="text-center text-gray-500">No chats available</p>
          )}
        </div>

        {/* Chat Blocks for Demo */}
        <div className="w-full overflow-auto">

        </div>
      </animated.div>
    </div>
  );
};

export default LeftBar;
