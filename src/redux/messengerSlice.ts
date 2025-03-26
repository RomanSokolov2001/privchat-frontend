import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ChatInterface, MessageInterface} from "../utils/types";

interface MessengerState {
    messages: MessageInterface[];
    messagesWithTimer: any[];
    chats: ChatInterface[];
    currentChat: ChatInterface | null;
    showSidebar: boolean | null;
    showProfile: boolean;
    isMobile: boolean;
    screenSize: { width: number; height: number };
    chatWidth: number;
    areTermsAccepted: boolean;
    expiredFiles: String[];
    showSetTimerWindow: boolean;
}

const initialState: MessengerState = {
    messages: [],
    messagesWithTimer: [],
    chats: [],
    currentChat: null,
    showSidebar: null,
    showProfile: false,
    isMobile: window.innerWidth < 1024,
    screenSize: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    chatWidth: window.innerWidth < 1024 ? window.innerWidth : window.innerWidth - 250,
    areTermsAccepted: false,
    expiredFiles: [],
    showSetTimerWindow: false,
};

const messengerSlice = createSlice({
    name: 'messenger',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<MessageInterface>) => {
            console.log('@redux: addMessage')
            // Directly add the message to the state
            state.messages.push(action.payload);
        },
        addUnreadToChat: (state, action: PayloadAction<string>) => {
            state.chats = state.chats.map((chat: ChatInterface) => {
                if (chat.chatId === action.payload) {
                    console.log('MUST BE ADDED!')
                    return {...chat, unreads: chat.unreads + 1};
                } else return chat;
            });
        },
        updateChatById: (state, action: PayloadAction<ChatInterface>) => {
            console.log('@redux: updateChatById')

            state.chats = state.chats.map((chat: ChatInterface) => {
                if (chat.chatId === action.payload.chatId) {
                    return {...chat, ...action.payload};
                } else return chat;
            });
            if (action.payload.timer && state.currentChat && (state.currentChat.chatId === action.payload.chatId)) {
                state.currentChat.timer = Number(action.payload.timer);
            }
        },
        updateMessageById: (state, action: PayloadAction<any>) => {
            console.log('@redux: updateMessageById')

            state.messages = state.messages.map((message: MessageInterface) => {
                if (message.id === action.payload.messageId) {
                    return {...message, ...action.payload};
                } else return message;
            });
        },
        deleteChatById: (state, action: PayloadAction<any>) => {
            state.chats = state.chats.filter(
                (chat: ChatInterface) => chat.chatId !== action.payload
            );

            if (state.currentChat?.chatId === action.payload) {
                state.currentChat = null;
            }
        },
        clearChatById: (state, action: PayloadAction<any>) => {
            state.messages = state.messages.filter(
                (message: MessageInterface) => message.chatId !== action.payload.chatId
            );
            const msg: MessageInterface = {
                time: new Date().toISOString(),
                sender: action.payload.senderNickname,
                receiver: '@',
                chatId: action.payload.chatId,
                content: 'Chat was cleared by',
                type: 'clear-chat',
                expiresAt: 0

            }
            state.messages.push(msg);
        },

        addChat: (state, action: PayloadAction<ChatInterface>) => {
            console.log('@redux: addChat')

            state.chats.push(action.payload);
        },
        setMessages: (state, action: PayloadAction<MessageInterface[]>) => {
            console.log('@redux: setMessages')

            state.messages = action.payload;
        },
        setChats: (state, action: PayloadAction<ChatInterface[]>) => {
            console.log('@redux: setChats')

            state.chats = action.payload;
        },
        setCurrentChat: (state, action: PayloadAction<ChatInterface | null>) => {
            console.log('@redux: setCurrentChat')

            state.currentChat = action.payload;
        },
        setShowSidebar: (state, action: PayloadAction<boolean>) => {
            console.log('@redux: setShowSidebar')

            state.showSidebar = action.payload;
        },
        setShowProfile: (state, action: PayloadAction<boolean>) => {
            console.log('@redux: setShowProfile')

            state.showProfile = action.payload;
        },
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            console.log('@redux: setIsMobile')

            state.isMobile = action.payload;
        },
        setScreenSize: (state, action: PayloadAction<{width: number, height: number}>) => {
            console.log('@redux: setScreenSize')
            state.screenSize = action.payload;
            state.isMobile = action.payload.width < 1024;
            state.chatWidth = state.isMobile ? action.payload.width : action.payload.width - 250;
        },
        setTermsAccepted: (state, action: PayloadAction<boolean>) => {
            console.log('@redux: setTermsAccepted')
            state.areTermsAccepted = action.payload;
        },
        setExpiredFiles: (state, action: PayloadAction<String[]>) => {
            console.log('@redux: setExpiredFiles')
            state.expiredFiles = action.payload;
        },
        setShowSetTimerWindow: (state, action: PayloadAction<boolean>) => {
            console.log('@redux: setShowSetTimerWindow')
            state.showSetTimerWindow = action.payload;
        },
        handleResize: (state) => {
            console.log('@redux: handleResize')
            const width = window.innerWidth;
            const height = window.innerHeight;
            state.isMobile = width < 1024;
            state.screenSize = { width, height };
            state.chatWidth = state.isMobile ? width : width - 250;
        }
    },
});

export const {
    setMessages,
    setChats,
    setCurrentChat,
    setShowSidebar,
    setShowProfile,
    setIsMobile,
    setScreenSize,
    setTermsAccepted,
    setExpiredFiles,
    setShowSetTimerWindow,
    handleResize,
    addMessage,
    addChat,
    updateChatById,
    updateMessageById,
    addUnreadToChat,
    deleteChatById,
    clearChatById
} = messengerSlice.actions;
export default messengerSlice.reducer;
