import React, { useEffect, useState } from 'react';
import { timeAgo } from '../utils/functions';
import { iconsRef } from '../utils/iconsRef';
import { FileEntry } from '../types';
import { animated, useSpring } from '@react-spring/web';

interface MessageProps {
  id: string;
  createdAt: string;
  text?: string;
  isOnLeft: boolean;
  isLast: boolean;
  fileEntry?: FileEntry;
  downloadFile?: (filename: string, fileType: string) => void;
  imageURLS?: string[];
}

const MessageFabric: React.FC<MessageProps> = ({
  id,
  createdAt,
  text,
  isOnLeft,
  isLast,
  fileEntry,
  downloadFile,
  imageURLS,
}) => {
  if (imageURLS && imageURLS.length > 0)
    return <MediaMessage id={id} createdAt={createdAt} isOnLeft={isOnLeft} isLast={isLast} imageURLS={imageURLS} />;
  if (fileEntry)
    return (
      <FileMessage
        id={id}
        createdAt={createdAt}
        isOnLeft={isOnLeft}
        isLast={isLast}
        fileEntry={fileEntry}
        downloadFile={downloadFile}
      />
    );
  return <TextMessage id={id} createdAt={createdAt} isOnLeft={isOnLeft} isLast={isLast} text={text} />;
};

export default MessageFabric;

// Subcomponent: MediaMessage
const MediaMessage: React.FC<MessageProps> = ({ id, createdAt, isOnLeft, isLast, imageURLS }) => {
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    config: { tension: 400, friction: 20 },
  }));

  useEffect(() => {
    api.start({ opacity: 1 });

  }, [api])

  return (
    <animated.div style={{ ...springs }}
      className={`mt-1 mb-1 p-[8px] ${isOnLeft ? '' : 'flex items-end'} flex-col ${isLast && 'pb-10'
        }`}
    >
      <section
        className={`p-2 rounded-3xl inline-block max-w-[400px] shadow-xl ${isOnLeft ? 'bg-white text-black' : 'bg-black text-white'
          }`}
      >
        <div
          className="grid gap-2"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(imageURLS!.length, 3)}, 1fr)`, // Max 3 columns
          }}
        >
          {imageURLS?.map((url: string) => (
            <img
              src={url}
              className="rounded-md cursor-pointer hover:scale-105 transition-transform"
              style={{ width: '100px', height: '100px', maxHeight: '150px', objectFit: 'cover' }}
            />
          ))}
        </div>
      </section>
      <section
        className={`text-[14px] font-black text-bold pl-3 pr-3 ${isOnLeft ? '' : 'flex justify-end'
          }`}
      >
        {timeAgo(createdAt)}
      </section>
    </animated.div>
  );
};

// Subcomponent: TextMessage
const TextMessage: React.FC<MessageProps> = ({ id, createdAt, text, isOnLeft, isLast }) => {
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    config: { tension: 400, friction: 20 },
  }));

  useEffect(() => {
    api.start({ opacity: 1 });

  }, [api])

  return (
    <animated.div style={{ ...springs }}
      className={`mt-1 mb-1 p-[8px] ${isOnLeft ? '' : 'flex items-end'} flex-col ${isLast && 'pb-10'
        }`}
    >
      <section
        className={`p-2 pl-5 pr-5 rounded-3xl inline-block max-w-[400px] break-words text-[25px] shadow-xl ${isOnLeft ? 'bg-white text-black' : 'bg-black text-white'
          }`}
      >
        {text}
      </section>
      <section
        className={`text-[14px] font-black text-bold pl-3 pr-3 ${isOnLeft ? '' : 'flex justify-end'
          }`}
      >
        {timeAgo(createdAt)}
      </section>
    </animated.div>
  );
};

// Subcomponent: FileMessage (unchanged)
const FileMessage: React.FC<MessageProps> = ({ id, createdAt, isOnLeft, isLast, fileEntry, downloadFile }) => {
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    config: { tension: 400, friction: 20 },
  }));

  useEffect(() => {
    api.start({ opacity: 1 });

  }, [api])

  useEffect(() => {
    if (!fileEntry) return;

    const timeRemaining = Math.max(0, fileEntry.acceptedAt + 5 * 60 * 1000 - Date.now());
    if (timeRemaining === 0) {
      setExpired(true);
      setTimeLeft('');
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const timeRemaining = fileEntry.acceptedAt + 5 * 60 * 1000 - now;

      if (timeRemaining <= 0) {
        setExpired(true);
        setTimeLeft('');
        clearInterval(interval);
      } else {
        const minutesLeft = Math.floor(timeRemaining / 60000);
        setTimeLeft(`${minutesLeft} m left`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [fileEntry]);

  if (fileEntry && downloadFile)
    return (
      <animated.div style={{ ...springs }}
        className={`mt-1 mb-1 p-[8px] ${isOnLeft ? '' : 'flex items-end'} flex-col ${isLast && 'pb-10'
          }`}
      >
        <section
          className={`p-2 pl-5 pr-5 rounded-3xl inline-block max-w-[400px] shadow-xl relative hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer ${isOnLeft ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          onClick={() => downloadFile(fileEntry.filename, fileEntry.fileType)}
        >
          <div className="flex flex-row">
            <Icon icon={isOnLeft ? iconsRef.fileBlack : iconsRef.fileWhite} />
            <div className="flex flex-col">
              <a>{fileEntry.originalFilename.slice(0, -4)}</a>
              <a
                className={`text-[15px] ${isOnLeft ? 'text-[#5c5c5c]' : 'text-[#c9c9c9]'
                  }`}
              >
                {fileEntry.size}
              </a>
            </div>
          </div>
          <div className="flex flex-row align-center items-end justify-center absolute right-2 bottom-2">
            {!expired && timeLeft && (
              <span
                className={`text-[14px] ${isOnLeft ? 'text-[#5c5c5c]' : 'text-[#c9c9c9]'
                  }`}
              >
                {timeLeft}
              </span>
            )}
            <img
              src={isOnLeft ? iconsRef.clocksBlack : iconsRef.clocksWhite}
              alt="Clock icon"
              width={25}
              height={25}
              className="ml-2"
            />
          </div>
        </section>
        <section
          className={`text-[14px] font-black text-bold pl-3 pr-3 ${isOnLeft ? '' : 'flex justify-end'
            }`}
        >
          {timeAgo(createdAt)}
        </section>
      </animated.div>
    );
  else return <li></li>;
};

// Helper Icon Component
const Icon = ({ icon, w = 50, h = 50 }: { icon: string; w?: number; h?: number }) => {
  return (
    <img
      src={icon}
      width={w}
      height={h}
      style={{ cursor: 'pointer' }}
    />
  );
};
