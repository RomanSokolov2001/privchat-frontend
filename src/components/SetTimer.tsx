import React, { useEffect, useState, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import {useMessenger} from "../context/MessengerContext";
import {useUser} from "../context/UserContext";
import {MessengerAPI} from "../api/MessengerAPI";
import {getOpponentNickname} from "../utils/functions";

interface TimeOption {
    value: number;
    unit: string;
    ms: number;
}

const SetTimer = () => {
    const { currentChat } = useMessenger();
    const { user } = useUser()
    const [activeTimeIndex, setActiveTimeIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const isScrolling = useRef(false);

    const timeOptions: TimeOption[] = [
        { value: 1, unit: 'second', ms: 1000 },
        { value: 5, unit: 'seconds', ms: 5000 },
        { value: 10, unit: 'seconds', ms: 10000 },
        { value: 30, unit: 'seconds', ms: 30000 },
        { value: 1, unit: 'minute', ms: 60000 },
        { value: 2, unit: 'minutes', ms: 120000 },
        { value: 5, unit: 'minutes', ms: 300000 },
        { value: 10, unit: 'minutes', ms: 600000 },
        { value: 30, unit: 'minutes', ms: 1800000 },
        { value: 1, unit: 'hour', ms: 3600000 },
    ];

    const ITEM_HEIGHT = 60;
    const CONTAINER_HEIGHT = 100;
    const VISIBLE_ITEMS = Math.floor(CONTAINER_HEIGHT / ITEM_HEIGHT);
    const MIDDLE_INDEX = Math.floor(VISIBLE_ITEMS / 2);


    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (isScrolling.current) return;

            const scrollTop = container.scrollTop;
            const newIndex = Math.round(scrollTop / ITEM_HEIGHT);

            if (newIndex !== activeTimeIndex && newIndex >= 0 && newIndex < timeOptions.length) {
                setActiveTimeIndex(newIndex);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [activeTimeIndex]);


    const handleTimeSelect = async () => {
        if (!currentChat || !user) return
        const selectedTime = timeOptions[activeTimeIndex];
        await MessengerAPI.sendTimerMessage(getOpponentNickname(user, currentChat), selectedTime.ms, user.jwt)
    };

    const scrollToIndex = (index: number) => {
        if (isScrolling.current) return;
        isScrolling.current = true;

        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTo({
                top: index * ITEM_HEIGHT,
                behavior: 'smooth'
            });
        }

        setActiveTimeIndex(index);
        setTimeout(() => {
            isScrolling.current = false;
        }, 500);
    };


    return (
                <div className="p-6 space-y-4 h-[300px] overflow-y-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Auto delete timer</h2>
                    </div>

                    <div className="h-[300px]">
                        <div
                            ref={scrollContainerRef}
                            className="h-full overflow-y-auto"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            <div style={{ height: `${ITEM_HEIGHT}px` }} />
                            {timeOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`
                    flex items-center justify-center
                    transition-colors duration-200
                    cursor-pointer
                    h-[${ITEM_HEIGHT}px]
                    ${index === activeTimeIndex
                                        ? 'text-[#4f4f4f] font-bold text-lg'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }
                  `}
                                    onClick={() => scrollToIndex(index)}
                                >
                                    {option.value} {option.unit}
                                </div>
                            ))}
                            <div style={{ height: `${ITEM_HEIGHT}px` }} />
                        </div>
                    </div>
                    <button
                        onClick={handleTimeSelect}
                        className="w-full py-3 bg-[#4f4f4f] text-white rounded-lg hover:bg-[#383838] transition-colors"
                    >
                        Set Timer
                    </button>
                </div>
    );
};

export default SetTimer;