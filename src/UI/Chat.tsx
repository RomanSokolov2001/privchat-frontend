import {Key, useEffect, useRef, useState} from 'react';

import {MessengerAPI} from '../api/MessengerAPI';
import {FileSharingAPI} from '../api/FileSharingAPI';
import {getOpponentNickname} from '../utils/functions';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {setMessages, updateMessageById} from "../redux/messengerSlice";

import {ChatInterface, MessageInterface} from '../utils/types';

import MessageFabric from './messages/MessageFabric';

const Chat = () => {
    const listRef = useRef<HTMLUListElement | null>(null);
    const user = useSelector((state: RootState) => state.user.user)
    const currentChat = useSelector((state: RootState) => state.messenger.currentChat)
    const currentChatRef = useRef<ChatInterface>();
    const messages = useSelector((state: RootState) => state.messenger.messages)
    const dispatch = useDispatch();
    const messagesRef = useRef<MessageInterface[]>([]);

    const [chatMessages, setChatMessages] = useState<MessageInterface[]>([])

    useEffect(() => {
        console.log('@useEffect in Chat')
        if (currentChat) {
            currentChatRef.current = currentChat
        }
        messagesRef.current = messages

        if (!currentChatRef.current || !user || !messages || messages.length === 0) {
            setChatMessages([]);
            return;
        }
        messagesRef.current = messages;


        const filteredMessages = messagesRef.current.filter(msg =>
            msg.chatId === currentChatRef.current?.chatId
        );
        const opponentNickname = getOpponentNickname(user, currentChat);
        const unwatchedMessages = messages.filter(msg =>
            (msg.sender === opponentNickname) &&
            !msg.isConfirmed &&
            (msg.receiver === user.nickname)
        );
        unwatchedMessages.forEach((msg) => {
            dispatch(updateMessageById({messageId: msg.id, isConfirmed: true}))
            MessengerAPI.confirmThatMessageWatched(msg.id, msg.sender, user.jwt)
        });

        const sortedMessages = filteredMessages.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );


        setChatMessages(sortedMessages);
    }, [currentChat, dispatch, messages]);

    // Filter messages for current chat

    // Auto-scroll to bottom
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // File download handler
    async function handleFileDownload(filename: string, fileType: string) {
        if (!currentChat || !user) return
        await FileSharingAPI.downloadEncryptedFile(
            filename,
            String(currentChat?.sharedSecretKey),
            user?.jwt,
            fileType
        )
    }

    return (
        <div className='w-full flex flex-col h-full overflow-hidden'>
            <ul ref={listRef} className="h-full overflow-auto pb-20">
                {chatMessages.map((message: MessageInterface, index: Key) => (
                    <MessageFabric
                        id={message.id}
                        imageURL={message.imageURL}
                        key={message.id || index}
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
                ))}
            </ul>
        </div>
    );
}

export default Chat;
