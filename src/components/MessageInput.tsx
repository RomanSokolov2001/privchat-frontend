import { useEffect, useState } from 'react';
import { useMessenger } from '../context/MessengerContext';
import AnimatedButton from './Button';
import { getOpponentNickname } from '../utils/functions';
import { MessengerAPI } from '../api/MessengerAPI';
import { useUser } from '../context/UserContext';
import { iconsRef } from '../utils/iconsRef';
import { FileSharingAPI } from '../api/FileSharingAPI';


const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const { user } = useUser();
  const { chatWidth, currentChat, setShowSetTimerWindow } = useMessenger();
  const [currentChatTimer, setCurrentChatTimer] = useState(0)

  useEffect(()=> {
    console.log('trigger')
    if (currentChat && currentChat.timer) {setCurrentChatTimer(currentChat?.timer)} else {console.log('to timer')}
    
  }, [currentChat])

  async function sendMessage() {
    if (!user || !currentChat) return;

    if (!selectedFile && message.trim()) {
      await MessengerAPI.sendMessage(
        getOpponentNickname(user, currentChat),
        message,
        String(currentChat.sharedSecretKey),
        user.jwt,
        currentChatTimer && new Date().getTime() + Number(currentChat.timer)
      );
      setMessage('');
    } else if (selectedFile) {
      await FileSharingAPI.uploadEncryptedFile(
        selectedFile,
        String(currentChat.sharedSecretKey),
        user.jwt,
        getOpponentNickname(user, currentChat),
        currentChatTimer && new Date().getTime() + Number(currentChat.timer)
      );
      setSelectedFile(null);
    } else if (selectedMedia) {
      await FileSharingAPI.uploadEncryptedMedia(
        selectedMedia,
        String(currentChat.sharedSecretKey),
        user.jwt,
        getOpponentNickname(user, currentChat),
        currentChatTimer && new Date().getTime() + Number(currentChat.timer)
      );
      setSelectedMedia(null);
    }
  }

  function handleFileSelect() {
    if (!user || !currentChat) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setSelectedFile(target.files[0]);
        console.log('Selected file:', target.files[0]);
        setMessage(''); // Clear the message input when a file is selected
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
        setSelectedMedia(file);
        console.log('Selected media:', file);
      }
    };
    input.click();
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setMessage('');
  }

  return (
    <div
      className="flex items-center p-4 h-[100px] absolute bottom-0 justify-center z-500"
      style={{ width: chatWidth, zIndex: 500 }}
    >
      <div className="flex" style={{ width: chatWidth * 0.7 }}>
        <div className="flex flex-row p-2 border border-[#4f4f4f] bg-white rounded mr-2 bg-transparent w-full relative">
          {selectedFile ? (
            <div className="flex flex-row items-center w-full text-black px-2">
              <span className="truncate">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
              <button
                onClick={clearSelectedFile}
                className="ml-2 text-red-500 hover:text-red-700"
                style={{ cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <input
              className="w-full text-black focus:outline-none focus:ring-0"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!!selectedFile} // Disable input when a file is selected
            />
          )}
          <div className="flex flex-row gap-2 max-h-[40px] mr-[2px] absolute right-[-2px] bottom-[2px]">
            <Icon icon={iconsRef.clocks} onClick={()=> setShowSetTimerWindow(true)} />
            <Icon icon={iconsRef.photo} onClick={handleMediaSelect} />
            <Icon icon={iconsRef.clip} w={35} h={35} onClick={handleFileSelect} />
          </div>
        </div>

        <AnimatedButton text={'Send'} onClick={sendMessage} />
      </div>
    </div>
  );
};

const Icon = ({
  icon,
  onClick,
  w = 30,
  h = 30,
}: {
  icon: string;
  onClick: () => void;
  w?: number;
  h?: number;
}) => {
  return (
    <img
      src={icon}
      width={w}
      height={h}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default MessageInput;