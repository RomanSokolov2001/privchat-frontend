export interface MessageDto {
    content: string
    receiverNickname: string
}

export interface ChatRequestDto {
    requesterPublicKey: string
    requestedNickname: string
}

export interface AcceptChatRequestDto {
    requestedPublicKey: string
}

export interface Message {
    createdAt: Date
    content: string
    sender: string
    receiver: string
}
export const IP = '16.171.206.255:8080'
export interface ChatInterface {
    requesterNickname: string
    requestedNickname: string
    requestedPublicKey: string
    requesterPublicKey: string
    sharedSecretKey: string
}

export interface ChatInterfaceDto {
    requesterNickname: string | undefined
    requestedNickname: string | undefined
    requestedPublicKey: string | undefined
    requesterPublicKey: string | undefined
}