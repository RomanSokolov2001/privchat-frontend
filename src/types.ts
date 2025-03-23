export interface MessageDto {
    content: string
    receiverNickname: string
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
