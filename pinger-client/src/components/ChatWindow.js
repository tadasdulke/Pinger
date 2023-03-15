import React, { useState } from 'react';
import cx from 'classnames'
import { useSelector } from 'react-redux';

const Message = ({body, isMessageSent}) => (
    <div className={cx("p-[10px] mt-[10px] bg-green-500 rounded-[5px]", isMessageSent ? "self-start" : "self-end")}>
        {body}
    </div>
)

const ChatWindow = ({receiverName, messages, handleMessageSending}) => {
    const { userId: senderId } = useSelector(state => state.auth)
    const [messageValue, setMessageValue] = useState('');

    return (
        <div className="flex justify-between flex-col h-full">
            <div className="flex bg-tuna p-[20px] text-white">
                {receiverName}
            </div>
            <div className="relative h-full">
                <div className="absolute overflow-y-scroll bottom-0 top-0 left-0 right-0">
                    <div className="px-[10px] flex flex-col">
                    {messages.map(({id, body, sender}) => (
                        <Message 
                            key={id} 
                            body={body}
                            isMessageSent={sender.id === senderId}
                        />
                    ))}
                    </div>
                </div>
            </div>
            <form onSubmit={handleMessageSending} className="flex bg-tuna p-[10px]">
                <input 
                    type="text" 
                    className="w-full"
                    name="message"
                    value={messageValue} 
                    onChange={(e) => setMessageValue(e.target.value)} 
                />
                <button 
                    className="p-[3px] rounded-[3px] ml-[5px] text-white bg-green-500" 
                    type="submit"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default ChatWindow;