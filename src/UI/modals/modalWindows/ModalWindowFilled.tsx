import { animated, useSpring } from "@react-spring/web";
import React, { useEffect } from "react";
import IconButton from "../../icons/IconButton/IconButton";
import {iconsRef} from "../../../utils/iconsRef";

const ModalWindow = ({isVisible, toggleVisible, header="Header", children}:{isVisible:boolean, toggleVisible: () => void, header: string, children: any}) => {
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

    // This function prevents event propagation
    function handleModalClick(e: { stopPropagation: () => void; }) {
        e.stopPropagation();
    }

    return (
        <animated.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[999]"
                      style={{ ...springs }}
                      onClick={onClose}
        >
            <WhiteFrame onClick={handleModalClick}>
                <div className="absolute right-[-5px] top-[-5px]">
                </div>

                <HeaderContainerFiled>
                    <h2 className="text-2xl pl-4 font-bold text-white">{header}</h2>
                    <IconButton imgSrc={iconsRef.cross} onClick={onClose} size={25}/>
                </HeaderContainerFiled>
                {children}
            </WhiteFrame>

        </animated.div>
    )
}

export default ModalWindow

const HeaderContainerFiled = ({children}:{children:any}) => {
    return <div className="flex rounded-t-xl justify-between items-center w-full flex-row bg-[#4f4f4f] w-full">
        {children}
    </div>
}

const WhiteFrame = ({children, onClick}:{children:any, onClick: any}) => {
    return <div onClick={onClick} className="bg-white rounded-2xl shadow-xl text-center min-w-[200px] min-h-[200px] relative">
        {children}
    </div>
}
