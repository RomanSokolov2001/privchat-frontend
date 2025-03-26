import { animated, useSpring } from "@react-spring/web";
import { timeAgo } from "../../utils/functions";
import { useEffect } from "react";
import { MediaMessageProps } from "../../utils/types";


const MediaMessage = (props: MediaMessageProps) => {
    const [springs, api] = useSpring(() => ({
      opacity: 0,
      config: { tension: 400, friction: 20 },
    }));

    useEffect(() => {
      api.start({ opacity: 1 });
    }, [api])

    return (
      <animated.div style={{ ...springs }}
        className={` mt-1 mb-1 p-[8px] flex items-${props.isOnLeft ? 'start' : 'end'} flex-col ${props.isLast && 'pb-10'}`}>
          <img
            src={props.imageURL}
            className="rounded-md shadow-xl max-w-[50%]"
            style={{ width: '100%', objectFit: 'cover' }}
          />
        <section className={`text-[14px] font-black text-bold pl-3 pr-3 ${props.isOnLeft && 'flex justify-end'}`}>
          {timeAgo(props.createdAt)}
        </section>
      </animated.div>
    );
  };

export default MediaMessage
