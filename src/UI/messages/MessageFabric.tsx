import FileMessage from "./FileMessage";
import { MessageProps } from "../../utils/types";
import MediaMessage from "./MediaMessage";
import TextMessage from "./TextMessage";
import TimerMessage from "./TimerMessage";
import ActionMessage from "./ActionMessage";


const MessageFabric: React.FC<MessageProps> = (props) => {
    if (props.imageURL) {
        return (
            <MediaMessage
                id={props.id}
                createdAt={props.createdAt}
                sender={props.sender}
                receiver={props.receiver}
                isReceived={props.isReceived}
                isWatched={props.isWatched}
                isLast={props.isLast}

                isOnLeft={props.isOnLeft}
                imageURL={props.imageURL}
            />
        );
    }

    if (props.fileEntry) {
        return (
            <FileMessage
                id={props.id}
                createdAt={props.createdAt}
                sender={props.sender}
                receiver={props.receiver}
                isReceived={props.isReceived}
                isWatched={props.isWatched}
                isLast={props.isLast}

                isOnLeft={props.isOnLeft}
                fileEntry={props.fileEntry}
                downloadFile={props.downloadFile!}
            />
        );
    }

    if (props.type === "timer") {
        return (
            <TimerMessage
                id={props.id}
                createdAt={props.createdAt}
                sender={props.sender}
                receiver={props.receiver}
                isReceived={props.isReceived}
                isWatched={props.isWatched}
                isLast={props.isLast}

                text={props.text || ''}
            />
        );
    }
    if (props.type === "clear-chat") {
        return (
            <ActionMessage
                id={props.id}
                createdAt={props.createdAt}
                sender={props.sender}
                receiver={props.receiver}
                isReceived={props.isReceived}
                isWatched={props.isWatched}
                isLast={props.isLast}

                text={props.text || ''}
            />
        );
    }

    return (
        <TextMessage
                id={props.id}
                createdAt={props.createdAt}
                sender={props.sender}
                receiver={props.receiver}
                isReceived={props.isReceived}
                isWatched={props.isWatched}
                isLast={props.isLast}

                isOnLeft={props.isOnLeft}
                text={props.text!}
        />
    );
};

export default MessageFabric;
