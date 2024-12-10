import './styles.css';

const ChatBlock = ({ nickname }: { nickname: string }) => {
  return (
    <div className="p-4 w-[100%] flex justify-center chat-block">
      <a className="text-xl chat-block-text">
        {nickname}
      </a>
    </div>
  );
};

export default ChatBlock;