import { animated, useSpring } from "@react-spring/web";
import { useEffect } from "react";
import { useMessenger } from "../../context/MessengerContext";

const SetTimerWindow = () => {
    const { showSetTimerWindow, setShowSetTimerWindow} = useMessenger()

    
    const [springs, api] = useSpring(() => ({
        opacity: showSetTimerWindow ? 0 : 1,
        config: { tension: 400, friction: 20 },
      }));
    
      useEffect(() => {
          api.start({ opacity: 1 });
    
      }, [api])

    function onClose() {
        api.start({ opacity: 0 });
        setShowSetTimerWindow(true)
    }
      
    return (
        <animated.div
        className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-999"
        style={{ ...springs }}
        onClick={onClose}
      >
        <div className="bg-white rounded-xl p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold mb-2">Set Self-Destruct Timer</h2>
          <p className="text-gray-600">LolOlololo</p>
        </div>
      </animated.div>
    )
}

export default SetTimerWindow