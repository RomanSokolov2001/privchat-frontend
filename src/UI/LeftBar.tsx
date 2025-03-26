import React, {useEffect, useRef, useMemo, useState} from 'react';
import {animated, useSpring} from '@react-spring/web';

import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {setChats, setCurrentChat, updateChatById} from "../redux/messengerSlice";
import {getOpponentNickname} from '../utils/functions';

import {ChatInterface} from '../utils/types';

import SearchBar from './animated/searchBar/SearchBar';
import ChatBlock from './animated/chatBlock/ChatBlock';

const LeftBar: React.FC = () => {
    const chats = useSelector((state: RootState) => state.messenger.chats)
    const chatsRef = useRef<ChatInterface[]>([])
    const user = useSelector((state: RootState) => state.user.user)
    const isMobile = useSelector((state: RootState) => state.messenger.isMobile)
    const showSidebar = useSelector((state: RootState) => state.messenger.showSidebar)
    const screenSize = useSelector((state: RootState) => state.messenger.screenSize)
    const [showedChats, setShowedChats] = useState<ChatInterface[]>([]);
    const dispatch = useDispatch();

    const [springs, api] = useSpring(() => ({
        x: -250,
        config: {tension: 300, friction: 30},
    }));

    useEffect(() => {
        console.log('@useEffect in LeftBar')
        chatsRef.current = chats;
        setShowedChats(chatsRef.current)
    }, [chats, dispatch]);

    function handleUpdateChatById(obj: any) {
        dispatch(updateChatById(obj))
    }

    function changeCurrentChat(chat: ChatInterface) {
        dispatch(setCurrentChat(chat))
    }

    function handleClick(chat: ChatInterface) {
        handleUpdateChatById({chatId: chat.chatId, unreads: 0})
        changeCurrentChat(chat)
    }

    useEffect(() => {
        if (isMobile) {
            api.start({x: showSidebar ? 0 : -250});
        } else {
            api.set({x: 0});
        }
    }, [isMobile, showSidebar, api]);

    // Memoized chat rendering to prevent unnecessary re-renders


    return (
        <div
            className={`${isMobile && showSidebar ? 'absolute w-full bg-[rgba(0,0,0,0.5)]' : ''}`}
            style={{zIndex: 999, height: `${screenSize.height - 80}px`}}
        >
            <animated.div
                className={`w-[250px] p-2 border-r border-gray-300 flex flex-col items-center bg-white shadow-xl z-500 ${
                    isMobile ? 'absolute h-full' : 'h-full left-[10px]'
                }`}
                style={{
                    maxHeight: `${screenSize.height - 80}px`,
                    height: `${screenSize.height - 80}px`,
                    ...springs,
                }}
            >
                <SearchBar/>

                <div className="w-full overflow-auto">
                    {chats.length > 0 ? (
                        <ul>{showedChats.map((chat: ChatInterface) => (
                            <ChatBlock
                                key={chat.chatId}
                                nickname={getOpponentNickname(user, chat)}
                                onClick={() => handleClick(chat)}
                                unreads={chat.unreads}
                            />
                        ))}</ul>
                    ) : (
                        <p className="text-center text-gray-500">No chats available</p>
                    )}
                </div>
            </animated.div>
        </div>
    );
};

export default LeftBar;
