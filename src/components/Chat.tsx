import { Key, useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useMessenger } from '../context/MessengerContext';
import { getOpponentNickname } from '../utils/functions';
import MessageFabric from './Message';
import { MessageInterface } from '../types';
import { MessengerAPI } from '../api/MessengerAPI';
import { FileSharingAPI } from '../api/FileSharingAPI';


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


  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [chatMessages]);

  async function handleFileDownload(filename: string, fileType: string) {
    if (!currentChat || !user) return
    await FileSharingAPI.downloadEncryptedFile(filename, String(currentChat?.sharedSecretKey), user?.jwt, fileType)
  }

  return (
    <ul ref={listRef} className="max-h-full overflow-auto" style={{
      maxHeight: `${screenSize.height - 80}px`,
      height: `${screenSize.height - 80}px`,
    }}>
      {chatMessages.map((message: MessageInterface, index: Key) => {
        return (
          <MessageFabric
            id={message.id}
            imageURLS={message.imageURLS}
            key={index}
            createdAt={message.time}
            text={message.content}
            fileEntry={message.fileEntry}
            isOnLeft={user?.nickname === message.receiver}
            isLast={index === chatMessages.length - 1}
            downloadFile={handleFileDownload}
          />
        )
      })}
    </ul>
  );
}

export default Chat;