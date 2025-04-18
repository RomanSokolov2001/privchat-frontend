import { useSpring, animated } from "@react-spring/web";
import { useEffect } from "react";
import { getStringFromMs } from "../../utils/functions";
import {ActionMessageProps} from "../../utils/types";


const ActionMessage = (props: ActionMessageProps) => {
    const [springs, api] = useSpring(() => ({
        opacity: 0,
        config: { tension: 400, friction: 20 },
    }));

    useEffect(() => {
        api.start({ opacity: 1 });
    }, [api])

    return (
        <animated.div style={{ ...springs }} className={`mt-1 mb-1 p-[8px] flex flex-col items-center w-full ${props.isLast && 'pb-[100px]'}`}>
            <section
                style={{ background: 'rgba(0, 0, 0, 0.1)' }}
                className={`pl-5 pr-5 rounded-3xl break-words text-[30px] text-black`}
            >
                <a className='font-bold'>{props.sender} </a>
                <a>cleared chat</a>
            </section>
        </animated.div>
    );
};

export default ActionMessage
