import { FileEntry } from "../../types";

export interface MessageProps {
    id: string;
    createdAt: string;
    text?: string;
    isOnLeft: boolean;
    isLast: boolean;
    fileEntry?: FileEntry;
    downloadFile?: (filename: string, fileType: string) => void;
    imageURL?: string;
    type: string;
    sender: string;
    receiver: string;
    isReceived: boolean;
    isWatched: boolean;
}

export interface TextMessageProps {
    id: string;
    createdAt: string;
    sender: string;
    receiver: string;
    isReceived: boolean;
    isWatched: boolean;
    isLast: boolean;

    isOnLeft: boolean;
    text: string;
}

export interface FileMessageProps {
    id: string;
    createdAt: string;
    sender: string;
    receiver: string;
    isReceived: boolean;
    isWatched: boolean;
    isLast: boolean;

    isOnLeft: boolean;
    fileEntry: FileEntry;
    downloadFile: (filename: string, fileType: string) => void;
}

export interface MediaMessageProps {
    id: string;
    createdAt: string;
    sender: string;
    receiver: string;
    isReceived: boolean;
    isWatched: boolean;
    isLast: boolean;

    isOnLeft: boolean;
    imageURL: string;
}

export interface TimerMessageProps {
    id: string;
    createdAt: string;
    sender: string;
    receiver: string;
    isReceived: boolean;
    isWatched: boolean;
    isLast: boolean;

    text: string;
}