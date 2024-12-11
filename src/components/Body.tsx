import { useMessenger } from "../context/MessengerContext"
import Chat from "./Chat"
import LeftBar from "./LeftBar"
import MessageInput from "./MessageInput"

const Body = () => {
    const { isMobile, showSidebar, currentChat } = useMessenger()

    return (
        <div className="flex flex-row bg-[#ebebeb] w-full h-full">
            {/* {(!isMobile || showSidebar) && <LeftBar />} */}
            <LeftBar/>
            {
            true ?
                <div className='w-full flex-col'>
                    <Chat />
                    <MessageInput />
                </div> : <div>Select a chat to start messaging</div>
                }

        </div>
    )
}

export default Body
