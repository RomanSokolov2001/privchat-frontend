import { useMessenger } from "../context/MessengerContext"
import Chat from "./Chat"
import LeftBar from "./LeftBar"
import MessageInput from "./MessageInput"
import SetTimerWindow from "./toasts/SetTimerWindow"

const Body = () => {

    return (
        <div className="flex flex-row bg-[#ebebeb] w-full h-full">
            {/* {(!isMobile || showSidebar) && <LeftBar />} */}
            <LeftBar/>
            {
            true ?
                <div className='w-full flex-col'>
                    <Chat />
                    <MessageInput />
                    {/* <SetTimerWindow/> */}
                </div> : <div>Select a chat to start messaging</div>
                }

        </div>
    )
}

export default Body
