import React from 'react'

interface MessageProps {
    time: string,
    text: string,
    isOnLeft: boolean,
    isLast: boolean
}

const Message: React.FC<MessageProps> = ({ time, text, isOnLeft, isLast }) => {
   
    return (
        <li className={`mt-1 mb-1 p-[8px] ${isOnLeft ? "" : "flex items-end"} flex-col ${isLast && 'pb-10'}`} >
                <section className={`${isOnLeft ? "bg-white text-black" : "bg-black text-white "} p-2 pl-5 pr-5 rounded-3xl inline-block max-w-[400px] break-words text-[25px] shadow-xl`}>
                    {text}
                </section>
                <section className={`text-[14px] font-black text-bold pl-3 pr-3 ${isOnLeft ? "" : "flex justify-end"}`}>
                    {timeAgo(time)}
                </section>

        </li>
    )
}

export default Message

function timeAgo(date: string): string {
    const dateObject = new Date(date);
    const seconds = Math.floor((new Date().getTime() - dateObject.getTime()) / 1000);
    const interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    if (interval === 1) {
        return interval + " year ago";
    }

    const months = Math.floor(seconds / 2628000);
    if (months > 1) {
        return months + " months ago";
    }
    if (months === 1) {
        return months + " month ago";
    }

    const days = Math.floor(seconds / 86400);
    if (days > 1) {
        return days + " days ago";
    }
    if (days === 1) {
        return days + " day ago";
    }

    const hours = Math.floor(seconds / 3600);
    if (hours > 1) {
        return hours + " hours ago";
    }
    if (hours === 1) {
        return hours + " hour ago";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes > 1) {
        return minutes + " minutes ago";
    }
    if (minutes === 1) {
        return minutes + " minute ago";
    }

    return "just now";
}