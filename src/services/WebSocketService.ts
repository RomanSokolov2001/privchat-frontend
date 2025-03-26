import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {MessengerAPI} from '../api/MessengerAPI';
import {getOpponentPublicKey} from '../utils/functions';
import DiffieHellmanService from './DiffieHellmanService';
import {ChatInterface, MessageInterface, User} from '../utils/types';
import {FileSharingAPI} from '../api/FileSharingAPI';
import {BASE_URL} from '../config';
import {Dispatch, MutableRefObject, RefObject, SetStateAction} from "react";


export const initializeWebSocket = (
    currentChatRef: RefObject<ChatInterface | undefined>,
    chatsRef: RefObject<ChatInterface[]>,
    messagesRef: RefObject<MessageInterface[]>,
    user: any,
    handleChatsChange: (chats: ChatInterface[]) => void,
    changeCurrentChat: (chat: ChatInterface) => void,
    changeMessages: (messages: MessageInterface[]) => void,
    handleAddMessage: any,
    handleUpdateChat: (chat: any) => void,
    handleUpdateMessage: (msg: any) => void,
    addUnreadToChat: any,
    handleDeleteChat: any,
    handleClearChat: any
) => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
            const sessionUrl = client.ws._transport.url;
            const sessionId = extractSessionId(sessionUrl);

            const subscription = client.subscribe(`/queue/specific-user-${sessionId}`, (msg) => {
                handleSocketUpdate(
                    JSON.parse(msg.body),
                    currentChatRef,
                    chatsRef,
                    messagesRef,
                    user,
                    handleChatsChange,
                    changeCurrentChat,
                    changeMessages,
                    handleAddMessage,
                    handleUpdateChat,
                    handleUpdateMessage,
                    addUnreadToChat,
                    handleDeleteChat,
                    handleClearChat
                );
            });

            if (subscription) {
                client.send('/app/chat.addUser', {}, user.nickname);

                if (user.invitationLink) {
                    MessengerAPI.sendChatRequest(
                        {requestedNickname: user.invitationLink, requesterPublicKey: user.publicKey},
                        user?.jwt
                    );
                }
            }
        },
        (error: any) => {
            console.error('STOMP connection error:', error);
        });

    return client;
};

export const disconnectWebSocket = (client: any) => {
    if (client) {
        client.disconnect();
    }
};

const extractSessionId = (sessionUrl: string): string => {
    const parts = sessionUrl.split('/');
    return `${parts[parts.length - 2]}`;
};

export const messageHandlers = {
    delete(wsMessage: any, deleteChat: any) {
        deleteChat(wsMessage.data.chatId);
    },
    clear(wsMessage: any, handleClearChat: any) {
        handleClearChat(wsMessage.data.chatId);
    },
    async request(user: any, setChats: any, setCurrentChat: any) {
        const fetchedChats = await MessengerAPI.getChats(user.publicKey, user.jwt);

        if (!fetchedChats) return
        const updatedChats = fetchedChats.map((chat: ChatInterface) => {
            if (user.invitationLink == chat.requestedNickname) {
                setCurrentChat(chat)
            }
            const otherPartyKey = getOpponentPublicKey(user, chat);
            const sharedKey = DiffieHellmanService.generateSharedSecret(otherPartyKey, user.secretKey)?.toString();
            return {...chat, sharedSecretKey: sharedKey || '', unreads: 0};
        });
        console.log('@request')
        setChats(updatedChats);
    },
    async file(wsMessage: any, addMessage: any) {

        addMessage({
            chatId: wsMessage.data.chatId,
            fileEntry: wsMessage.data,
            sender: wsMessage.data.sender,
            receiver: wsMessage.data.receiver,
            createdAt: String(new Date()),
            id: wsMessage.data.id
        })
    },
    async message(wsMessage: any, chatsRef: any, addMessage: any) {
        const {sender, content: encryptedContent, receiver, id, chatId} = wsMessage.data || {};
        if (!sender || !encryptedContent) return;

        const chat = chatsRef.current.find(
            (chat: any) => chat.chatId === chatId
        );

        const sharedKey = chat?.sharedSecretKey;
        const decryptedContent = DiffieHellmanService.decrypt(encryptedContent, String(sharedKey));
        if (!decryptedContent) {
            console.error("Could decrypt content")
            throw Error("Could decrypt content")
        }

        addMessage(
            {
                chatId: wsMessage.data.chatId,
                content: decryptedContent,
                sender: sender,
                receiver: receiver,
                createdAt: String(new Date()),
                id
            })
    },

    async media(wsMessage: any, chatsRef: any, addMessage: any, user: any) {
        const chat = chatsRef.current.find(
            (chat: any) => chat.chatId === wsMessage.data.chatId
        );

        const sharedKey = chat?.sharedSecretKey;

        const file = await FileSharingAPI.downloadEncryptedMedia(wsMessage.data.filename, sharedKey, user?.jwt, wsMessage.data.fileType)

        const imageURL = URL.createObjectURL(file)
        addMessage(
            {
                content: "",
                sender: wsMessage.data.sender,
                receiver: wsMessage.data.receiver,
                createdAt: String(new Date()),
                imageURL: imageURL,
                chatId: wsMessage.data.chatId,
                id: wsMessage.data.id
            },
        );
    },
    async timer(wsMessage: any, addMessage: any, updateChat: any) {
        const {sender, content: content, receiver, chatId} = wsMessage.data || {};
        if (!sender || !content) return;

        updateChat({chatId, timer: content})

        addMessage(
            {
                chatId,
                content: content,
                sender: sender,
                receiver: receiver,
                createdAt: String(new Date()),
                type: 'timer',
                id: wsMessage.data.id
            }
        )
    },
    reached(messageId: string, updateMessage: any) {
        updateMessage({messageId: messageId, isReceived: true});
    },
    watched(messageId: string, updateMessage: any) {
        updateMessage({messageId: messageId, isWatched: true});

    },
    async notify(
        wsMessage: any,
        addUnreadToChat: any,
        currentChatRef: MutableRefObject<ChatInterface | null>,
    ): Promise<void> {
        const isThisCurrentChat = !!currentChatRef.current && (currentChatRef.current.chatId === wsMessage.data.chatId);
        if (!isThisCurrentChat) {
            console.log('close!')
            addUnreadToChat(wsMessage.data.chatId)
        }
    }
}

const handleSocketUpdate = async (wsMessage: any, currentChatRef: any, chatsRef: any, messagesRef: any, user: any, setChats: any, setCurrentChat: any, setMessages: any, handleNewMessage: any, handleUpdateChat: any, handleUpdateMessage: any, addUnreadToChat: any, handleDeleteChat: any, handleClearChat: any) => {
    let isMessageInCurrentChat = false

    if (!wsMessage.data) return;
    console.log('Receiving websocket: ', wsMessage.data);
    if (currentChatRef && wsMessage.data.sender !== user.nickname) {
        isMessageInCurrentChat = currentChatRef.requesterNickname === wsMessage.data.sender || currentChatRef.requestedNickname === wsMessage.data.sender
    }

    switch (wsMessage.data.type) {
        case 'request':
            console.log('It is request!');

            await messageHandlers.request(user, setChats, setCurrentChat);
            break;
        case 'file':
            console.log('It is file!');

            if (wsMessage.data.sender !== user.nickname) {
                await MessengerAPI.confirmThatMessageReached(wsMessage.data.id, wsMessage.data.sender, user?.jwt, isMessageInCurrentChat)
                await messageHandlers.notify(wsMessage, addUnreadToChat, currentChatRef);
            }
            await messageHandlers.file(wsMessage, handleNewMessage);
            break;
        case 'message':
            console.log('It is message!');

            if (wsMessage.data.sender !== user.nickname) {
                await MessengerAPI.confirmThatMessageReached(wsMessage.data.id, wsMessage.data.sender, user?.jwt, isMessageInCurrentChat)
                await messageHandlers.notify(wsMessage, addUnreadToChat, currentChatRef);
            }
            await messageHandlers.message(wsMessage, chatsRef, handleNewMessage);

            break;
        case 'media':
            console.log('It is media!');

            if (wsMessage.data.sender !== user.nickname) {
                await MessengerAPI.confirmThatMessageReached(wsMessage.data.id, wsMessage.data.sender, user?.jwt, isMessageInCurrentChat)
                await messageHandlers.notify(wsMessage, addUnreadToChat, currentChatRef);
            }

            await messageHandlers.media(wsMessage, chatsRef, handleNewMessage, user);

            break;
        case 'delete-chat':
            console.log('It is delete-chat!');

            messageHandlers.delete(wsMessage, handleDeleteChat);
            break;
        case 'clear-chat':
            messageHandlers.clear(wsMessage, handleClearChat);

            // TODO
            break;
        case 'timer':
            console.log('It is timer!');

            await messageHandlers.timer(wsMessage, handleNewMessage, handleUpdateChat);
            break;
        case 'reached':
            console.log('It is reached!');
            messageHandlers.reached(wsMessage.data.messageId, handleUpdateMessage);
            break;
        case 'watched':
            console.log('It is watched!');

            messageHandlers.watched(wsMessage.data.messageId, handleUpdateMessage);
            break;
    }
    wsMessage.data.expiresAt && scheduleMessageDeletion(wsMessage.data.id, wsMessage.data.expiresAt, messagesRef, setMessages);
};

const scheduleMessageDeletion = (messageId: string, expiresAt: number, messagesRef: MutableRefObject<MessageInterface[]>, setMessages: (messages: MessageInterface[]) => void) => {
    const timeUntilDeletion = expiresAt - Date.now();

    if (timeUntilDeletion > 0) {
        setTimeout(() => {
            setMessages(messagesRef.current.filter((msg) => msg.id !== messageId));
            console.log(`Message with ID ${messageId} has been deleted.`);
        }, timeUntilDeletion);
    }
};

