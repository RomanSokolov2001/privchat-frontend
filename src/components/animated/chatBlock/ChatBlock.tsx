import { animated, to, useSpring } from '@react-spring/web';
import './styles.css';
import { useEffect, useState } from 'react';

const ChatBlock = ({ nickname, onClick }: { nickname: string, onClick: () => void }) => {
  const [isClicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false)

  const [spring, set] = useSpring(() => ({
    from: { bgNumber: 0, opacity: 0 },
    to: async next => {
      if (!isClicked) {
        while (1) {
          if (isClicked) break;
          await next({ bgNumber: 1 });
          await next({ bgNumber: 0 });
        }
      }
    },
    config: {
      duration: 1000
    }
  }));

  const [bgSpring, bgApi] = useSpring(() => ({
    number: 0,
    config: { duration: 10 },
  }))
  const [opacitySpring, opacityApi] = useSpring(()=> ({
    number: 0,
    config: { duration: 10 },
  }))
  useEffect(()=> {
    opacityApi.start({
      number: 1
    })
  })

  const interpolateBgColor = to([bgSpring.number], (n) => {
    const value = Math.round(255 - (55 * n));
    return `rgb(${value}, ${value}, ${value})`;
  });

  const interpolateColor = to([spring.bgNumber], (n) => {
    const value = Math.round(255 - (55 * n));
    return `rgb(${value}, ${value}, ${value})`;
  });


  function handleClick() {
    onClick();
    setClicked(true);

    set.stop();
    set({ bgNumber: 0 });
  }

  const [hoverSpring, api] = useSpring(() => ({
    backgroundColor: isHovered ? '#e0e0e0' : '#ffffff',
    config: { duration: 200 }
  }));

  useEffect(() => {
    set.start({ opacity: 1 });
  }, []);

  useEffect(() => {
    if (isHovered) {
      bgApi.start({
        number: 1
      })
    } else {
      bgApi.start({
        number: 0
      })
    }
  }, [isHovered])

  return (
    <animated.div
      style={{
        opacity: spring.opacity,
        backgroundColor: isClicked ? interpolateBgColor : interpolateColor
      }}
      className="p-4 w-[100%] flex justify-center chat-block"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a className="text-xl chat-block-text">
        {nickname}
      </a>
    </animated.div>
  );
};

export default ChatBlock;