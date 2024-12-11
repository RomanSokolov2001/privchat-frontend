import { useContext, useState } from 'react';
import { useMessenger } from '../context/MessengerContext';
import AnimatedButton from './Button';


const MessageInput = ({ updateMessages }: any) => {
  const [message, setMessage] = useState('');
  const { chatWidth } = useMessenger()

  const handleSend = () => {

  };

  return (
    <div className="flex items-center p-4 h-[100px] absolute bottom-0 justify-center" style={{ width: chatWidth, zIndex: 500 }}>
      <div className= 'flex' style={{width: chatWidth*0.7}}>
        <input
          type="text"
          className="flex-grow p-2 border border-[#4f4f4f] bg-white rounded mr-2 bg-transparent w-full  text-black focus:outline-none focus:ring-0"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <AnimatedButton text={'Send'} onClick={()=>console.log('')}/>
          
      
      </div>

    </div>
  );
};

export default MessageInput;