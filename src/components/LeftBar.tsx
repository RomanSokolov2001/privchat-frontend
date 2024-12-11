import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { MessengerService } from '../api/MessengerService';
import { useUser } from '../context/UserContext';
import { ChatInterface } from '../types';
import { useMessenger } from '../context/MessengerContext';
import { getOpponentNickname } from '../utils/functions';
import SearchBar from './animated/searchBar/SearchBar';
import ChatBlock from './animated/chatBlock/ChatBlock';

const LeftBar: React.FC = () => {
  const { user } = useUser();
  const { chats, setCurrentChat, isMobile, screenSize, showSidebar } = useMessenger();
  const [searchTerm, setSearchTerm] = useState('');
  const [showedChats, setShowedChats] = useState<ChatInterface[]>([]);

  const [springs, api] = useSpring(() => ({
    x: -250,
    config: { tension: 300, friction: 30 },
  }));

  // Update chats display when chats change
  useEffect(() => {
    setShowedChats(chats || []);
  }, [chats]);

  // Handle sidebar animation based on screen size
  useEffect(() => {
    if (isMobile) {
      api.start({ x: showSidebar ? 0 : -250 });
    } else {
      api.set({ x: 0 }); // Reset to default on larger screens
    }
  }, [isMobile, showSidebar, api]);

  // Send chat request
  async function handleSendingRequest() {
    if (!user) return;
    const response = await MessengerService.sendChatRequest(
      { requestedNickname: searchTerm, requesterPublicKey: user.publicKey },
      user.jwt
    );
    if (response === 'success') {
      setSearchTerm('');
    }
  }

  // Render list of chats
  const renderChats = () => {
    return showedChats.map((chat: ChatInterface) => (
      <li
         // Ensure unique key for React list rendering
        onClick={() => setCurrentChat(chat)}
        className="cursor-pointer py-2 hover:bg-gray-100"
      >
        {getOpponentNickname(user, chat)}
      </li>
    ));
  };

  return (
    <div
      className={`${isMobile && showSidebar ? 'absolute w-full bg-[rgba(0,0,0,0.5)]' : ''}`}
      style={{ zIndex: 999, height: `${screenSize.height - 80}px`,}}
    >
      <animated.div
        className={`w-[250px] p-2 border-r border-gray-300 flex flex-col items-center bg-white shadow-xl ${
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
          {showedChats.length > 0 ? (
            <ul>{renderChats()}</ul>
          ) : (
            <p className="text-center text-gray-500">No chats available</p>
          )}
        </div>

        {/* Chat Blocks for Demo */}
        <div className="w-full overflow-auto">
          <ChatBlock nickname="MyFriend2943" />
          <ChatBlock nickname="SuperPimkpin233" />
          <ChatBlock nickname="DearBroad233" />
        </div>
      </animated.div>
    </div>
  );
};

export default LeftBar;
