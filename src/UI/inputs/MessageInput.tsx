import {useState} from 'react';

import {RootState} from "../../redux/store";
import {useSelector} from "react-redux";
import {getOpponentNickname} from '../../utils/functions';
import {FileSharingAPI} from '../../api/FileSharingAPI';
import {MessengerAPI} from '../../api/MessengerAPI';

import {iconsRef} from '../../utils/iconsRef';

import AnimatedButton from '../buttons/Button';
import CustomIcon from "../icons/CustomIcon";


const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<File | null>(null);
    const [selectedType, setSelectedType] = useState('');

    const user = useSelector((state: RootState) => state.user.user);
    const currentChat = useSelector((state: RootState) => state.messenger.currentChat);


    async function sendMessage() {
        if (!user || !currentChat) return;

        if (!selectedDoc && message.trim()) {
            await MessengerAPI.sendMessage(
                getOpponentNickname(user, currentChat),
                message,
                String(currentChat.sharedSecretKey),
                currentChat.chatId,
                user.jwt,
                currentChat.timer && new Date().getTime() + Number(currentChat.timer)
            );
            setMessage('');
        } else if (selectedDoc && selectedType === 'file') {
            await FileSharingAPI.uploadEncryptedFile(
                selectedDoc,
                currentChat.chatId,
                String(currentChat.sharedSecretKey),
                user.jwt,
                getOpponentNickname(user, currentChat),
                currentChat.timer && new Date().getTime() + Number(currentChat.timer)
            );
            setSelectedDoc(null);
        } else if (selectedDoc && selectedType === 'media') {
            await FileSharingAPI.uploadEncryptedMedia(
                selectedDoc,
                currentChat.chatId,
                String(currentChat.sharedSecretKey),
                user.jwt,
                getOpponentNickname(user, currentChat),
                currentChat.timer && new Date().getTime() + Number(currentChat.timer)
            );
            setSelectedDoc(null);
        }
    }

    function handleFileSelect() {
        if (!user || !currentChat) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                setSelectedDoc(target.files[0]);
                setSelectedType('file');
                console.log('Selected file:', target.files[0]);
                setMessage('');
            }
        };
        input.click();
    }

    function handleMediaSelect() {
        if (!user || !currentChat) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                setSelectedDoc(file);
                setSelectedType('media')
                console.log('Selected media:', file);
            }
        };
        input.click();
    }

    function clearSelectedFile() {
        setSelectedDoc(null);
        setMessage('');
    }

    if (currentChat) {
        return (
            <div className=" min-w-[400px] w-full flex items-center p-4 h-[100px] bottom-0 justify-center z-500">
                <div
                    className="flex flex-row pl-2 border border-[#4f4f4f] bg-white rounded mr-2 bg-transparent w-full relative pt-1 pb-1">
                    {selectedDoc ? (
                        <div className="flex flex-row items-center w-full text-black px-2">
                            <span className="truncate">
                                {selectedDoc.name} ({(selectedDoc.size / 1024).toFixed(2)} KB)
                            </span>
                            <button
                                onClick={clearSelectedFile}
                                className="ml-2 text-red-500 hover:text-red-700"
                                style={{cursor: 'pointer'}}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <input
                            className="w-full text-black focus:outline-none focus:ring-0 pr-3"
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={!!selectedDoc} // Disable input when a file is selected
                        />
                    )}
                    <div className="flex flex-row items-center gap-1 pr-2">
                        <CustomIcon icon={iconsRef.photo} onClick={handleMediaSelect}/>
                        <CustomIcon icon={iconsRef.clip} w={35} h={35} onClick={handleFileSelect}/>
                    </div>
                </div>
                <div>
                    <AnimatedButton text={'Send'} onClick={sendMessage}/>
                </div>
            </div>
        )
    } else return <></>
};

export default MessageInput;
