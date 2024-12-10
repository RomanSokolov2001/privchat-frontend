import { useMessenger } from "../context/MessengerContext"
import Chat from "./Chat"
import LeftBar from "./LeftBar"

const Body = () => {
    const {isMobile, showSidebar, currentChat} = useMessenger()

    return (
        <div style={{ display: 'flex', flex: 1 }}>
            {(!isMobile || showSidebar) && <LeftBar/>}
             {currentChat ? <Chat/> : <div>Select a chat to start messaging</div>}
            {/* <button onClick={() => setRefreshTrigger(refreshTrigger + 1)}>Refresh</button> */}

       </div>
    )
}

export default Body