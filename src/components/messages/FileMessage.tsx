import { useSpring, animated } from "@react-spring/web";
import { useState, useEffect } from "react";
import { timeAgo } from "../../utils/functions";
import { iconsRef } from "../../utils/iconsRef";
import Icon from "../Icon";
import { FileMessageProps } from "./interfaces";


const FileMessage = (props: FileMessageProps) => {
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
        const timeRemaining = Math.max(0, props.fileEntry.acceptedAt + 5 * 60 * 1000 - Date.now());
        if (timeRemaining === 0) {
            setExpired(true);
            setTimeLeft('');
            return;
        }

        const updateCountdown = () => {
            const now = Date.now();
            const timeRemaining = props.fileEntry.acceptedAt + 5 * 60 * 1000 - now;

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
    }, [props.fileEntry]);

    return (
        <animated.div style={{ ...springs }}
            className={`mt-1 mb-1 p-[8px] flex items-${props.isOnLeft ? 'start' : 'end'} flex-col ${props.isLast && 'pb-10'}`}>
            <section
                className={`p-2 pl-2 pr-5 rounded-3xl inline-block min-w-[210px] max-w-[400px] shadow-xl relative hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer ${props.isOnLeft ? 'bg-white text-black' : 'bg-black text-white' }`}
                onClick={() => props.downloadFile(props.fileEntry.filename, props.fileEntry.fileType)}
            >
                <div className="flex flex-row">
                    <Icon icon={props.isOnLeft ? iconsRef.fileBlack : iconsRef.fileWhite} />
                    <div className="flex flex-col">
                        <a>{props.fileEntry.originalFilename.slice(0, -4)}</a>
                        <a className={`text-[15px] text-${props.isOnLeft ? '[#5c5c5c]' : '[#c9c9c9]'}`}>
                            {props.fileEntry.size}
                        </a>
                    </div>
                </div>
                {!expired && timeLeft && (
                    <div className="flex flex-row align-center items-end justify-center absolute right-2 bottom-2">
                        <span className={`text-[14px] ${props.isOnLeft ? 'text-[#5c5c5c]' : 'text-[#c9c9c9]'}`}>
                            {timeLeft}
                        </span>
                        <img
                            src={props.isOnLeft ? iconsRef.clocksBlack : iconsRef.clocksWhite}
                            alt="Clock icon"
                            width={25}
                            height={25}
                            className="ml-2"
                        />
                    </div>
                )}
            </section>
            <section className={`text-[14px] font-black text-bold pl-3 pr-3 ${props.isOnLeft ? '' : 'flex justify-end'}`}>
                {timeAgo(props.createdAt)}
            </section>
        </animated.div>
    );
};

export default FileMessage