import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames'
import { useFetchData, withErrorWrapper } from '@Common';
import getPrivateMessages from './services/getPrivateMessages';

const Message = ({body, isMessageReceived}) => (
    <div className={cx("p-[10px] mt-[10px] bg-green-500 rounded-[5px]", isMessageReceived ? "self-end" : "self-start")}>
        {body}
    </div>
)


const ChatMessages = ({errorHandler, connection}) => {
    const [messages, setMessages] = useState([]);
    const [messageValue, setMessageValue] = useState('');
    const {userId: receiverId, userName} = useSelector(state => state.chat.occupierInfo);

    connection.on("ReceiveMessage", data => {
        setMessages([...messages, data])
    });

    const { loaded, result } = useFetchData(
        () => getPrivateMessages(receiverId),
        errorHandler,
        null,
        [receiverId]
    )

    useEffect(() => {
        if(result && result.data) {
            setMessages(result.data)
        }
    }, [result])

    const sendMessage = () => {
        connection.invoke("SendPrivateMessage", receiverId, messageValue)
    }
    
    return (
        <div className="flex justify-between flex-col h-full">
            <div className="flex bg-tuna p-[20px] text-white">
                {userName}
            </div>
            <div className="px-[10px] flex h-full flex-col justify-end">
                {messages.map(({id, body, sender}) => (
                    <Message 
                        key={id} 
                        body={body}
                        isMessageReceived={sender.id === receiverId}
                    />
                ))}
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

export default withErrorWrapper(ChatMessages);