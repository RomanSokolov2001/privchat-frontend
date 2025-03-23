import { Key, useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useMessenger } from '../context/MessengerContext';
import { getOpponentNickname } from '../utils/functions';
import MessageFabric from '../components/messages/MessageFabric';
import { MessageInterface } from '../types';
import { MessengerAPI } from '../api/MessengerAPI';
import { FileSharingAPI } from '../api/FileSharingAPI';


const Chat = () => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const { user } = useUser()
  const { messages, setMessages, currentChat, screenSize } = useMessenger()
  const [chatMessages, setChatMessages] = useState<any>([])


  useEffect(() => {
    function loadMessages() {
      if (!currentChat || !user) return
      const filteredMessages = messages.filter(msg =>
        msg.sender == getOpponentNickname(user, currentChat) ||
        msg.receiver == getOpponentNickname(user, currentChat)
      );

      setChatMessages(filteredMessages);
    }

    loadMessages()
  }, [currentChat, messages])

  useEffect(() => {
    function watchMessages() {
      if (!currentChat || !user) return
      const unwatchedMessages = messages.filter(msg =>
        (msg.sender == getOpponentNickname(user, currentChat) ||
        msg.receiver == getOpponentNickname(user, currentChat)) &&
        msg.isWatched !== true &&
        msg.sender == getOpponentNickname(user, currentChat)
      );
      unwatchedMessages.map((msg) => {
        MessengerAPI.confirmThatMessageWatched(msg.id, msg.sender, user.jwt)
      });
    }
    watchMessages()
  }, [currentChat])


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
    <ul ref={listRef} className="h-full overflow-auto pb-20">
      {chatMessages.map((message: MessageInterface, index: Key) => {
        return (
          <MessageFabric
            id={message.id}
            imageURL={message.imageURL}
            key={index}
            createdAt={message.createdAt}
            text={message.content}
            fileEntry={message.fileEntry}
            isOnLeft={user?.nickname === message.receiver}
            isLast={index === chatMessages.length - 1}
            downloadFile={handleFileDownload}
            type={message.type}
            sender={message.sender}
            receiver={user?.nickname || ''}
            isReceived={message.isReceived || false}
            isWatched={message.isWatched || false}
          />
        )
      })}
    </ul>
  );
}

export default Chat;
