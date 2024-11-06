import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LeftBar, { getOpponentNickname } from '../components/LeftBar';
import Chat from '../components/Chat';
import { useUser } from '../context/UserContext';
import {  MessengerService } from '../api/MessengerService';
import { AcceptChatRequestDto, ChatInterface } from '../types';


const Messenger: React.FC = () => {
  const { user } = useUser()
  const [selectedChat, setSelectedChat] = useState<ChatInterface | null>(null);
  const [chats, setChats] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (user == null) return

    console.log('Triggered:')

    async function loadChats() {
      if (user == null) return

      const chats = await MessengerService.getChats()
      if (chats.length) {
        setChats(chats)
      }
    }
    async function acceptIncomingRequests() {
      if (user == null) return

      const requests = await MessengerService.getChatRequests()
      if (requests.length > 0) {
        requests.map(async (rq: AcceptChatRequestDto) => {
          rq.requestedPublicKey = user.publicKey
          await MessengerService.acceptChatRequest(rq)
        })
      }
    }
    acceptIncomingRequests()
    loadChats()
  }, [refreshTrigger])

  const handleChatSelect = (chat: ChatInterface) => {
    setSelectedChat(chat);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header userNickname={user && user.nickname} chatNickname={selectedChat && getOpponentNickname(user, selectedChat) || 'No chat selected'} />
      <div style={{ display: 'flex', flex: 1 }}>
        <LeftBar chats={chats} onChatSelect={handleChatSelect} trigger={refreshTrigger} />
        {selectedChat ? (
          <Chat chat={selectedChat}  trigger={refreshTrigger}
          />
        ) : (
          <section style={{ flex: 1, padding: '10px' }}>
            <p>Select a chat to start messaging</p>
          </section>

        )}
      </div>
      <button onClick={() => setRefreshTrigger(refreshTrigger + 1)}>
        Reftesh
      </button>
    </div>
  );
};

export default Messenger;