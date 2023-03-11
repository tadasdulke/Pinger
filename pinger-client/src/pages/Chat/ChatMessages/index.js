import React, {useState} from 'react';
import { useSelector } from 'react-redux';


const ChatMessages = ({connection}) => {
    const [messageValue, setMessageValue] = useState('');
    const {userId, userName} = useSelector(state => state.chat.occupierInfo);

    const sendMessage = () => {
        connection.invoke("SendPrivateMessage", userId, messageValue)
    }
    
    return (
        <div className="flex justify-between flex-col h-full">
            <div className="flex bg-tuna p-[20px] text-white">
                {userName}
            </div>
            <div className="flex bg-tuna p-[10px]">
                <input 
                    type="text" 
                    className="w-full" 
                    value={messageValue} 
                    onChange={(e) => setMessageValue(e.target.value)} 
                />
                <button 
                    className="p-[3px] rounded-[3px] ml-[5px] text-white bg-green-500" 
                    type="button"
                    onClick={sendMessage}    
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatMessages;