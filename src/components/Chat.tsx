import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { MessengerService } from '../api/MessengerService';
import { useMessenger } from '../context/MessengerContext';
import { Message } from '../types';
import { getOpponentNickname } from '../utils/functions';


const Chat = () => {
  const { user } = useUser()
  const {messages, setMessages, currentChat} = useMessenger()
  const [chatMessages, setChatMessages] = useState<any>([])
  const [message, setMessage] = useState('');
  const [opponentNickname, setOpponentNickname] = useState<string>('')



  useEffect(() => {
    if (!currentChat) return
    function loadMessages() {
      if (!currentChat) return
      const filteredMessages = messages.filter(msg => 
        msg.sender == getOpponentNickname(user, currentChat) || 
        msg.receiver == getOpponentNickname(user, currentChat)
      );

      setChatMessages(filteredMessages);
    }

    loadMessages()
  }, [currentChat, messages])

  const sendMessage = async () => {
    if (!user || !currentChat) return
    if (message.trim()) {
      setMessage('');
      await MessengerService.sendMessage(getOpponentNickname(user, currentChat), message, String(currentChat.sharedSecretKey), user.jwt)
    }
    const messageToSave: Message = 
    {
      sender: user.nickname,
      receiver: getOpponentNickname(user, currentChat),
      createdAt: new Date(),
      content: message
    }
    setMessages((prev)=> [...prev, messageToSave])

  };

  return (
    <section style={{ flex: 1, padding: '10px' }}>
      <h3>Chatting with {opponentNickname} Secret: {currentChat&& currentChat.sharedSecretKey.toString()}</h3>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
        {chatMessages.map((msg: { sender: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; content: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
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