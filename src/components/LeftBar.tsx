import React, { useEffect, useState } from 'react';
import { MessengerService } from '../api/MessengerService';
import { useUser } from '../context/UserContext';
import { ChatInterface } from '../types';




interface LeftBarProps {
  chats: ChatInterface[];
  onChatSelect: (chat: ChatInterface) => void;
  trigger: number
}




const LeftBar: React.FC<LeftBarProps> = ({ chats, onChatSelect, trigger }) => {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState('');
  const [showedChats, setShowedChats] = useState<ChatInterface[]>([])

  useEffect(() => {
    setShowedChats(chats)
  }, [chats, trigger])




  async function handleSearch() {
    if (!user) return
    const response = await MessengerService.trySendChatRequest(
      { requestedNickname: searchTerm, requesterPublicKey: user.publicKey }
    )
    if (response == 'success') {
      setSearchTerm('')
    }
  }


  return (
    <aside style={{ width: '250px', padding: '10px', borderRight: '1px solid #ccc' }}>
      <div className='flex'>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <button className='pr-2 pl-2 bg-slate-300 rounded-xl' onClick={() => handleSearch()}> + </button>
      </div>

      <ul>
        {chats.map(chat => (
          <li
            onClick={() => onChatSelect(chat)}
            style={{ cursor: 'pointer', padding: '5px 0' }}
          >
            {getOpponentNickname(user, chat)}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LeftBar;


export function getOpponentNickname(user: any, chat: ChatInterface) {
  if (user?.nickname == chat.requesterNickname) return chat.requestedNickname
  else { return chat.requesterNickname }
}

export function getOpponentPublicKey(user: any, chat: ChatInterface) {
  if (user?.publicKey == chat.requesterPublicKey) return chat.requestedPublicKey
  else { return chat.requesterPublicKey }
}
