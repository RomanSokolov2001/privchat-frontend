// Chat.tsx
import { useEffect, useState } from 'react';
import { getOpponentNickname, getOpponentPublicKey } from './LeftBar';
import { useUser } from '../context/UserContext';
import DiffieHellmanService from '../api/DiffieHellmanService';
import { ChatInterface, Message } from '../types';
import { MessengerService } from '../api/MessengerService';

interface ChatProps {
  chat: ChatInterface
  trigger: number
}

const Chat = ({ chat, trigger }: ChatProps) => {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [sharedSecret, setSharedSecret] = useState<string>()
  const [opponentNickname, setOpponentNickname] = useState('')

  useEffect(() => {
    if (chat && user && !sharedSecret) {
      setOpponentNickname(getOpponentNickname(user, chat))
      const otherPartyPublicKey = getOpponentPublicKey(user, chat)
      const ownPrivateKey = user.secretKey
      const result = DiffieHellmanService.generateSharedSecret(otherPartyPublicKey, ownPrivateKey)
      if (result) {
        setSharedSecret(String(result))
      }
    }
    async function loadMessages() {
      if (chat && sharedSecret) {
        console.log('Loading messages')
        const decryptedMessages = await MessengerService.getMessagesFromUser(getOpponentNickname(user, chat), sharedSecret)
        setMessages(decryptedMessages)
      }
    }
    loadMessages()
  }, [chat, trigger])

  const sendMessage = async () => {
    if (!sharedSecret) return
    if (message.trim()) {
      console.log('Sending message')

      setMessage('');
      await MessengerService.sendMessage(opponentNickname, message, sharedSecret)
    }
  };

  return (
    <section style={{ flex: 1, padding: '10px' }}>
      <h3>Chatting with {opponentNickname} Secret: {sharedSecret?.toString()}</h3>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg.sender}: {msg.content}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: '5px' }}
      />
      <button onClick={sendMessage} style={{ marginLeft: '5px' }}>Send</button>
    </section>
  );
};

export default Chat;
