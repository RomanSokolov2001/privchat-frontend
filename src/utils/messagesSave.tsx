import React, { useEffect, useState } from 'react';
import { getStringFromMs, timeAgo } from '../utils/functions';
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
  imageURL?: string;
  type: string;
  sender?: string;
  receiver?: string;
  isRecieved?: string;
  isWatched?: string;
}

const MessageFabric: React.FC<MessageProps> = ({
  id,
  createdAt,
  text,
  isOnLeft,
  isLast,
  fileEntry,
  downloadFile,
  imageURL,
  type,
  sender,
  receiver,
  isRecieved,
  isWatched,
}) => {
  if (imageURL)
    return <MediaMessage id={id} createdAt={createdAt} isOnLeft={isOnLeft} isLast={isLast} imageURL={imageURL} type={type} isRecieved={isRecieved} isWatched={isWatched} />;
  if (fileEntry)
    return (
      <FileMessage
        id={id}
        createdAt={createdAt}
        isOnLeft={isOnLeft}
        isLast={isLast}
        fileEntry={fileEntry}
        downloadFile={downloadFile}
        type={type}
      />
    );

  if (type == 'timer') return <TimerMessage id={id} createdAt={createdAt} isOnLeft={isOnLeft} isLast={isLast} text={text} sender={sender} type={type} isRecieved={isRecieved} isWatched={isWatched} />
  return <TextMessage id={id} createdAt={createdAt} isOnLeft={isOnLeft} isLast={isLast} text={text} type={type} isRecieved={isRecieved} isWatched={isWatched} />;
};

export default MessageFabric;

// Subcomponent: MediaMessage
const MediaMessage: React.FC<MessageProps> = ({ id, createdAt, isOnLeft, isLast, imageURL }) => {
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    config: { tension: 400, friction: 20 },
  }));

  useEffect(() => {
    api.start({ opacity: 1 });

  }, [api])

  return (
    <animated.div style={{ ...springs }}
      className={`mt-1 mb-1 p-[8px] ${isOnLeft ? 'flex items-start' : 'flex items-end'} flex-col ${isLast && 'pb-10'
        }`}
    >
      <section
        className={`shadow-xl`}
      >

        <img
          src={imageURL}
          className="rounded-md"
          style={{ width: '100%', objectFit: 'cover' }}
        />
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
const TextMessage: React.FC<MessageProps> = ({ id, createdAt, text, isOnLeft, isLast, isRecieved, isWatched }) => {
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    config: { tension: 400, friction: 20 },
  }));

  useEffect(() => {
    api.start({ opacity: 1 });

  }, [api])

  function getTick() {
    if (true) return (
      <Icon icon={iconsRef.tickDouble} w={35} h={30}/>
    )
    if (isWatched) return ( 
      <Icon icon={iconsRef.tick} />
    )

  }

  return (
    <animated.div style={{ ...springs }}
      className={`mt-1 mb-1 p-[8px] ${isOnLeft ? '' : 'flex items-end'} flex-col ${isLast && 'pb-10'
        }`}
    >
      <section className='flex'>
        {getTick()}
        <div className={`p-2 pl-5 pr-5 rounded-3xl inline-block max-w-[400px] break-words text-[25px] shadow-xl ${isOnLeft ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
          {text}

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
    console.log(isLast)
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
          className={`p-2 pl-2 pr-5 rounded-3xl inline-block min-w-[210px] max-w-[400px] shadow-xl relative hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer ${isOnLeft ? 'bg-white text-black' : 'bg-black text-white'
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
          {!expired && timeLeft && (
            <div className="flex flex-row align-center items-end justify-center absolute right-2 bottom-2">

              <span
                className={`text-[14px] ${isOnLeft ? 'text-[#5c5c5c]' : 'text-[#c9c9c9]'
                  }`}
              >
                {timeLeft}
              </span>
              <img
                src={isOnLeft ? iconsRef.clocksBlack : iconsRef.clocksWhite}
                alt="Clock icon"
                width={25}
                height={25}
                className="ml-2"
              />
            </div>
          )}

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

// Subcomponent: TextMessage
const TimerMessage: React.FC<MessageProps> = ({ id, createdAt, text, isLast, sender }) => {
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    config: { tension: 400, friction: 20 },
  }));

  useEffect(() => {
    console.log(isLast)
    api.start({ opacity: 1 });

  }, [api])

  return (
    <animated.div style={{ ...springs }}
      className={`mt-1 mb-1 p-[8px] flex flex-col items-center w-full ${isLast && 'pb-[100px]'}`}
    >
      <section
        style={{ background: 'rgba(0, 0, 0, 0.1)' }}
        className={` pl-5 pr-5 rounded-3xl break-words text-[30px] text-black`}
      >
        <a className='font-bold'>{sender} </a>
        set self-destruct timer to
        <a className='font-bold'> {getStringFromMs(text)}</a>

      </section>

    </animated.div>
  );
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
