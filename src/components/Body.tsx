import { useMessenger } from "../context/MessengerContext"
import { useUser } from "../context/UserContext"
import { getOpponentNickname } from "../utils/functions"
import Chat from "./Chat"
import ChatManager from "./ChatManager"
import LeftBar from "./LeftBar"
import MessageInput from "./MessageInput"
import SetTimerWindow from "./toasts/SetTimerWindow"

const Body = () => {
    const {currentChat} = useMessenger()
    const {user} = useUser()

    return (
        <div className="flex flex-row bg-[#ebebeb] w-full h-full overflow-hidden">
            <LeftBar/>
            <div className='w-full flex flex-col h-full overflow-hidden'>
                <ChatManager/>
                <div className="flex-grow overflow-auto">
                    <Chat />
                </div>
                {currentChat && <MessageInput />}
                <SetTimerWindow/>
            </div>
        </div>
    )
}

export default Body
