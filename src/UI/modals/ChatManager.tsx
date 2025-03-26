import {useEffect, useRef, useState} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import { getOpponentNickname } from "../../utils/functions";
import { MessengerAPI } from "../../api/MessengerAPI";

import { iconsRef } from "../../utils/iconsRef";
import {ChatInterface, TimeOption} from "../../utils/types";

import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import IconButtonFilled from "../icons/IconButtonFilled/IconButtonFilled";
import IconButton from "../icons/IconButton/IconButton";
import ModalWindowFilled from "./modalWindows/ModalWindowFilled";
import AnimatedButton from "../buttons/Button";

const ChatManager = () => {
    const [currentAction, setCurrentAction] = useState('');
    const currentChat = useSelector((state: RootState) => state.messenger.currentChat);
    const isMobile = useSelector((state: RootState) => state.messenger.isMobile);
    const user = useSelector((state: RootState) => state.user.user);
    const currentChatRef = useRef<ChatInterface>()

    useEffect(() => {
        if (currentChat) {
            currentChatRef.current = currentChat;
        }
    }, [currentChat]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedTimer, setSelectedTimer] = useState<TimeOption | null>(null);

    const timeOptions: TimeOption[] = [
        { display: 'None', ms: -1 },
        { display: '5 seconds', ms: 5000 },
        { display: '15 seconds', ms: 15000 },
        { display: '1 minute', ms: 60000 },
        { display: '5 minutes', ms: 300000 },
        { display: '30 minutes', ms: 1800000 },
        { display: '1 hour', ms: 3600000 }
    ];

    const handleTimeSelect = async () => {
        if (!currentChatRef.current || !user || !selectedTimer) return;
        await MessengerAPI.sendTimerMessage(getOpponentNickname(user, currentChat), currentChatRef.current.chatId, selectedTimer.ms, user.jwt);
        setIsOpen(false);
    };

    function handleClose() {
        setIsOpen(false);
        setCurrentAction('');
        setSelectedTimer(null);
    }

    const handleChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        const selected = timeOptions.find(option => option.display === selectedValue) || null;
        setCurrentAction('');
        setSelectedTimer(selected);
    };

    async function handleClearOrDelete() {
        if (!currentChat || !user) return;
        if (currentAction === 'clear') {
            await MessengerAPI.sendClearCommand(getOpponentNickname(user, currentChat), currentChat.chatId, user.jwt);
        }
        if (currentAction === 'delete') {
            await MessengerAPI.sendDeleteCommand(getOpponentNickname(user, currentChat), currentChat.chatId, user.jwt);
        }
        handleClose();
    }

    function getRelatedDisplayToMs(ms: number): string {
        const matchedOption = timeOptions.find(option => {
            console.log(typeof ms)
            console.log(typeof option.ms)
            return option.ms === ms
        });
        if (matchedOption) {
            return matchedOption.display;
        }


        console.error('No matching time option found for: ' + ms);
        return 'None'; // Default fallback
    }


    const ConfirmElement = () => {
        if (currentAction) {
            return (
                <div className="w-full flex flex-col justify-end h-[200px] overflow-hidden">
                    <p className="text-xl font-semibold pl-4 pr-4">{`Are you sure you want to ${currentAction} chat?`}</p>
                    <div className="flex items-center flex-row justify-between w-full p-2 gap-4">
                        <AnimatedButton text="Yes" onClick={handleClearOrDelete} color="#a32f2f" />
                        <AnimatedButton text="Cancel" onClick={handleClose} color="#bababa" />
                    </div>
                </div>
            );
        } else if (selectedTimer) {
            return (
                <div className="w-full flex flex-col justify-end h-[200px] overflow-hidden">
                    <p className="text-xl font-semibold pl-4 pr-4">{`Set ${selectedTimer.display} delete timer?`}</p>
                    <div className="flex items-center flex-row justify-between w-full p-2 gap-4">
                        <AnimatedButton text="Yes" onClick={handleTimeSelect} color="#a32f2f" />
                        <AnimatedButton text="Cancel" onClick={handleClose} color="#bababa" />
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!currentChat) return null;

    // @ts-ignore
    return (
        <div className="p-1 bg-white flex justify-center items-center w-full">
            <p className={`${isMobile ? "text-xl" : "text-2xl"} ml-2`}>
                Chat with:
                <span className={`${isMobile ? "text-xl" : "text-2xl"} font-bold ml-2`}>
                    {getOpponentNickname(user, currentChat)}
                </span>
            </p>
            <IconButtonFilled imgSrc={iconsRef.settings} onClick={() => setIsOpen(true)} />

            {isOpen && (
                <ModalWindowFilled isVisible={isOpen} toggleVisible={handleClose} header="Chat Settings">
                    <div className="flex items-start justify-center flex-col p-2 gap-3 pl-5 pr-5 w-[350px] h-[360px]">
                        <div className="flex items-center flex-row justify-between w-full">
                            <p className="text-xl font-[400]">Clear chat:</p>
                            <IconButton imgSrc={iconsRef.brush} onClick={() => setCurrentAction('clear')} />
                        </div>
                        <div className="flex items-center flex-row justify-between w-full">
                            <p className="text-xl font-[400]">Delete chat:</p>
                            <IconButton imgSrc={iconsRef.bin} onClick={() => setCurrentAction('delete')} />
                        </div>
                        <div className="flex items-center flex-row justify-between w-full">
                            <p className="text-xl font-[400]">Set Timer</p>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    // @ts-ignore
                                    value={selectedTimer?.display || getRelatedDisplayToMs(currentChatRef.current.timer)}
                                    onChange={handleChange}
                                    inputProps={{ "aria-label": "Without label" }}
                                >
                                    {timeOptions.map((option) => (
                                        <MenuItem key={option.ms} value={option.display}>
                                            {option.display}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <ConfirmElement />
                    </div>
                </ModalWindowFilled>
            )}
        </div>
    );
};

export default ChatManager;
