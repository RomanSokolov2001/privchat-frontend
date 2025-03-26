import { useSpring, animated } from "@react-spring/web";
import { useEffect } from "react";
import { timeAgo } from "../../utils/functions";
import { iconsRef } from "../../utils/iconsRef";
import CustomIcon from "../icons/CustomIcon";
import { TextMessageProps } from "../../utils/types";


const TextMessage = (props:TextMessageProps) => {
    const [springs, api] = useSpring(() => ({
        opacity: 0,
        config: { tension: 400, friction: 20 },
    }));


    useEffect(() => {
        api.start({ opacity: 1 });
    }, [api])

    function getTick() {
        if (props.isWatched) return (
            <CustomIcon icon={iconsRef.tickDouble} w={35} h={30} />
        )
        if (props.isReceived) return (
            <CustomIcon icon={iconsRef.tick} />
        )
    }

    return (
        <animated.div style={{ ...springs }}
            className={`mt-1 mb-1 p-[8px] flex items-${props.isOnLeft ? 'start' : 'end'} flex-col ${props.isLast && 'pb-10'}`}
        >
            <section className='flex'>
                {getTick()}
                <div className={`p-2 pl-5 pr-5 rounded-3xl inline-block max-w-[400px] break-words text-[25px] shadow-xl ${props.isOnLeft ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {props.text}
                </div>
            </section>

            <section
                className={`text-[14px] font-black text-bold pl-3 pr-3 flex justify-${props.isOnLeft ? 'start' : 'end'}`}>
                {timeAgo(props.createdAt)}
            </section>
        </animated.div>
    );
};

export default TextMessage
