export interface MessageDto {
    content: string
    receiverNickname: string
}

export interface User {
    nickname: string;
    email?: string;
    jwt: string;
    secretKey: string;
    publicKey: string;
    expiresIn: number;
    invitationLink?: string;
}

export interface ChatRequestDto {
    requesterPublicKey: string
    requestedNickname: string
    chatId: string
}

export interface AcceptChatRequestDto {
    requestedPublicKey: string
}

export interface MessageInterface {
    [x: string]: any
    content?: string
    sender: string
    receiver: string
    time: string
    fileEntry?: FileEntry
    imageURLS?: string[]
    randomId?: string
    expiresAt: number
}
export interface ChatInterface {
    requesterNickname: string
    requestedNickname: string
    requestedPublicKey: string
    requesterPublicKey: string
    sharedSecretKey: string
    chatId: string
    timer: number
    unreads: number
}

export interface ChatInterfaceDto {
    requesterNickname: string | undefined
    requestedNickname: string | undefined
    requestedPublicKey: string | undefined
    requesterPublicKey: string | undefined
}

export interface FileEntry {
    fileType: string
    filename: string
    originalFilename: string
    acceptedAt: number
    size: string
    receiver: string
    sender: string
}

export interface MediaEntry {
    filename: string
    file: string
    randomId: string
    receiver: string
    sender: string
}

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

export interface ActionMessageProps {
    id: string;
    createdAt: string;
    sender: string;
    receiver: string;
    isReceived: boolean;
    isWatched: boolean;
    isLast: boolean;
    text: string;
}

export interface TimeOption {
    display: string,
    ms: number;
}
