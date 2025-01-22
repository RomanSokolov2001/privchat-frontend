import { useMessenger } from "../context/MessengerContext"
import Chat from "./Chat"
import LeftBar from "./LeftBar"
import MessageInput from "./MessageInput"
import SetTimerWindow from "./toasts/SetTimerWindow"

const Body = () => {
    const {currentChat} = useMessenger()

    return (
        <div className="flex flex-row bg-[#ebebeb] w-full h-full">
            <LeftBar/>
            <div className='w-full flex-col'>
                <Chat />
                {currentChat && <MessageInput />}
                 <SetTimerWindow/>
            </div>
        </div>
    )
}

export default Body