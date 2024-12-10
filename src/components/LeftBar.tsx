import React, { useEffect, useState } from 'react';
import { MessengerService } from '../api/MessengerService';
import { useUser } from '../context/UserContext';
import { ChatInterface } from '../types';
import { useMessenger } from '../context/MessengerContext';
import { getOpponentNickname } from '../utils/functions';
import SearchBar from './animated/searchBar/SearchBar';
import ChatBlock from './animated/chatBlock/ChatBlock';


const LeftBar: React.FC = () => {
  const { user } = useUser();
  const { chats, setCurrentChat, isMobile } = useMessenger();
  const [searchTerm, setSearchTerm] = useState('');
  const [showedChats, setShowedChats] = useState<ChatInterface[]>([]);

  useEffect(() => {
    if (chats) {
      setShowedChats(chats);
    } else {
      setShowedChats([]);
    }
  }, [chats]);

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

  const renderChats = () => {
    return (
      showedChats.map((chat: ChatInterface) => (
        <li
          onClick={() => setCurrentChat(chat)}
          style={{ cursor: 'pointer', padding: '5px 0' }}
        >
          {getOpponentNickname(user, chat)}
        </li>
      ))
    );
  }

  return (
    <aside className={`w-[250px] p-2 border-r border-gray-300 flex flex-col items-center bg-white h-screen shadow-xl ${isMobile && 'absolute'}`}>
      <SearchBar />
      {/* Uncomment and modify if you want an input for search */}
      {/* <div className='flex'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <button className='pr-2 pl-2 bg-slate-300 rounded-xl' onClick={handleSendingRequest}> + </button>
      </div> */}
      {/* Uncomment to use the rendered chats */}
      {/* <ul>
        {renderChats()}
      </ul> */}

      {/* Adjust the height to take into account the header */}
      <div className="w-full" style={{ maxHeight: 'calc(100vh - 124px)', overflowY: 'auto' }}>
        {/* Chat blocks that will be scrollable if content exceeds the screen */}
        <ChatBlock nickname="MyFriend2943" />
        <ChatBlock nickname="SuperPimkpin233" />
        <ChatBlock nickname="DearBroad233" />

      </div>
    </aside>
  );
};

export default LeftBar;
