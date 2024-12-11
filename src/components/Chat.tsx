import { Key, useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { MessengerService } from '../api/MessengerService';
import { useMessenger } from '../context/MessengerContext';
import { getOpponentNickname } from '../utils/functions';
import Message from './Message';
import { MessageInterface } from '../types';
import MessageInput from './MessageInput';


const Chat = () => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const { user } = useUser()
  const { messages, setMessages, currentChat, screenSize } = useMessenger()
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
    const messageToSave: MessageInterface =
    {
      sender: user.nickname,
      receiver: getOpponentNickname(user, currentChat),
      time: String(new Date()),
      content: message
    }
    setMessages((prev) => [...prev, messageToSave])

  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <ul ref={listRef} className="max-h-full overflow-auto" style={{
      maxHeight: `${screenSize.height - 80}px`,
      height: `${screenSize.height - 80}px`,
    }}>
      {templateMsgs.map((message: MessageInterface, index: Key) => (
        <Message
          key={index}
          time={message.time}
          text={message.content}
          isOnLeft={'Bob' === message.sender}
          isLast={index === templateMsgs.length - 1}
        />
      ))}
    </ul>
  );
}

export default Chat;

export const templateMsgs: MessageInterface[] = [
  {
    content: "Hey, how are you?",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "I'm good, thanks! How about you?",
    sender: "Bob",
    receiver: "Alice",
    time: String(new Date()),
  },
  {
    content: "Doing great! Are we still on for lunch tomorrow?",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Yes, definitely! Let's meet at 12:30?",
    sender: "Bob",
    receiver: "Alice",
    time: String(new Date()),
  },
  {
    content: "Perfect. See you then!",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Hey, can you send me the report by today?",
    sender: "Bob",
    receiver: "Alice",
    time: String(new Date()),
  },
  {
    content: "Sure thing! I'll send it over in an hour.",
    sender: "Bob",
    receiver: "Alice",
    time: String(new Date()),
  },
  {
    content: "Hi, did you get a chance to review the document?",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Yes, I did. It looks good, just a couple of minor changes needed.",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Got it, I'll make those changes right away.",
    sender: "Bob",
    receiver: "Frank",
    time: String(new Date()),
  },
  {
    content: "Yes, I did. It looks good, just a couple of minor changes needed.",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Got it, I'll make those changes right away.",
    sender: "Bob",
    receiver: "Frank",
    time: String(new Date()),
  },
  {
    content: "Yes, I did. It looks good, just a couple of minor changes needed.",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Got it, I'll make those changes right away.",
    sender: "Bob",
    receiver: "Frank",
    time: String(new Date()),
  },
  {
    content: "Yes, I did. It looks good, just a couple of minor changes needed.",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Got it, I'll make those changes right away.",
    sender: "Bob",
    receiver: "Frank",
    time: String(new Date()),
  },
  {
    content: "Yes, I did. It looks good, just a couple of minor changes needed.",
    sender: "Alice",
    receiver: "Bob",
    time: String(new Date()),
  },
  {
    content: "Got it, I'll make those changes right away.",
    sender: "Bob",
    receiver: "Frank",
    time: String(new Date()),
  }
];

