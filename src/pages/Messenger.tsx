import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LeftBar, { getOpponentNickname } from '../components/LeftBar';
import Chat from '../components/Chat';
import { useUser } from '../context/UserContext';
import {  MessengerService } from '../api/MessengerService';
import { AcceptChatRequestDto, ChatInterface, ChatInterfaceDto } from '../types';

import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';


const Messenger: React.FC = () => {
  const { user } = useUser()
  const [selectedChat, setSelectedChat] = useState<ChatInterface | null>(null);
  const [chats, setChats] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // const [stompClient, setStompClient] = useState<Client | null>(null);  const [connected, setConnected] = useState(false);
  // const [wsMessages, setWsMessages] = useState<any[]>([]);

  // const [mounted, setMounted] = useState(false)

  
  useEffect(() => {
    if (user == null) return

    async function loadChats() {
      if (user == null) return
     

      const chats = await MessengerService.getChats(user.publicKey)
      if (chats.length) {
        setChats(chats)
        console.log(chats)
      }
    }

    loadChats()
  }, [refreshTrigger])

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
        var url = client.ws._transport.url;
        const sessionId =
            url.replace("ws://localhost:8080/ws/", "")
                .replace("/websocket", "")
                .replace(/^[0-9]+\//, "")
                .replace(/^[0-9]+\//, "");


        client.subscribe("/queue/specific-user-" + sessionId, (msg) => {
            const message: any = JSON.parse(msg.body);
            handleSocketUpdate();
        });
        client.send("/app/chat.addUser", {}, user?.nickname);
    });

    return () => {
        if (client) {
            client.disconnect();
        }
    };
}, [user]);

function handleSocketUpdate() {

  console.log("Catched")

}
  
  

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