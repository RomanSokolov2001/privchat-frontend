import { ChatInterface } from "../types"

export function getOpponentNickname(user: any, chat: ChatInterface) {
    if (user?.nickname == chat.requesterNickname) return chat.requestedNickname
    else { return chat.requesterNickname }
  }
  
  export function getOpponentPublicKey(user: any, chat: ChatInterface) {
    if (user?.publicKey == chat.requesterPublicKey) return chat.requestedPublicKey
    else { return chat.requesterPublicKey }
  }