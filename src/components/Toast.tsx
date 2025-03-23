import { animated, useSpring } from "@react-spring/web";
import { useEffect } from "react";

const Toast = ({isVisible, toggleVisible, header, text}:{isVisible:boolean, toggleVisible: () => void, text: string, header: string}) => {
    const [springs, api] = useSpring(() => ({
        opacity: isVisible ? 0 : 1,
        config: { tension: 400, friction: 20 },
      }));
    
      useEffect(() => {
          api.start({ opacity: 1 });
    
      }, [api])

    function onClose() {
        api.start({ opacity: 0 });
        toggleVisible()
    }
      
    return (
        <animated.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[999]"
        style={{ ...springs }}
        onClick={onClose}
      >
        <div className="bg-white rounded-xl p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold mb-2">{header}</h2>
          <p className="text-gray-600">{text}</p>
        </div>
      </animated.div>
    )
}

export default Toast