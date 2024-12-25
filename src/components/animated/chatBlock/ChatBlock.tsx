import './styles.css';

const ChatBlock = ({ nickname, onClick }: { nickname: string, onClick: () => void }) => {
  return (
    <div className="p-4 w-[100%] flex justify-center chat-block" onClick={onClick}>
      <a className="text-xl chat-block-text">
        {nickname}
      </a>
    </div>
  );
};

export default ChatBlock;