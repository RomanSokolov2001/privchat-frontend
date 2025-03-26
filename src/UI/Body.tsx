import Chat from "./Chat"
import ChatManager from "./modals/ChatManager"
import LeftBar from "./LeftBar"
import MessageInput from "./inputs/MessageInput"

const Body = () =>
    <div className="flex flex-row bg-[#ebebeb] w-full h-full overflow-hidden">
        <LeftBar/>
        <div className='w-full flex flex-col h-full overflow-hidden'>
            <ChatManager/>
            <Chat/>
            <MessageInput/>
        </div>
    </div>

export default Body
