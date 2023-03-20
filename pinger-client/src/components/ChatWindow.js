import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames'
import { useSelector, useDispatch } from 'react-redux';
import { useOnScreen } from '@Common'

const Message = ({body, isMessageSent}) => (
    <div className={cx("p-[10px] mt-[10px] bg-green-500 rounded-[5px] max-w-[49%] break-words", isMessageSent ? "self-start" : "self-end")}>
        {body}
    </div>
)

const ChatWindow = ({receiverName, messages, handleMessageSending, chatActions, lazyLoadComponent, onIsAtButtonUpdate}) => {
    const { userId: senderId } = useSelector(state => state.auth)
    const [messageValue, setMessageValue] = useState('');
    const [seeNewMessagesButtonVisible, setSeeNewMessagesButtonVisible] = useState(false);
    const messageEndRef = useRef();
    const scrollRef = useRef();
    const isAtBottom = useOnScreen(messageEndRef);

    const scrollToBottom = (options) => {
        messageEndRef.current?.scrollIntoView(options)
    }

    useEffect(() => {
        if(isAtBottom) {
            scrollToBottom();
        } else {
            setSeeNewMessagesButtonVisible(true);
        }
    }, [messages])

    useEffect(() => {
        scrollToBottom();
    }, [])

    useEffect(() => {
        if(isAtBottom) 
        {
            setSeeNewMessagesButtonVisible(false);
        }
    }, [isAtBottom])

    useEffect(() => {
        onIsAtButtonUpdate && onIsAtButtonUpdate(isAtBottom)
    }, [isAtBottom])

    return (
        <div className="flex justify-between flex-col h-full">
            <div className="flex justify-between bg-tuna p-[20px] text-white">
                {receiverName}
                {chatActions}
            </div>
            <div className="relative h-full">
                {seeNewMessagesButtonVisible && 
                    <button 
                        className="p-[10px] rounded-[5px] absolute bg-tuna z-10 bottom-[20px] left-1/2 translate-x-[-50%] text-white"
                        onClick={() => scrollToBottom({behavior: "smooth"})}
                    >
                            See new messages
                    </button>
                }
                <div ref={scrollRef} className="absolute overflow-y-auto bottom-0 top-0 left-0 right-0">
                    <div className="px-[10px] flex flex-col">
                        {lazyLoadComponent}
                            {messages.map(({id, body, sender}) => (
                                <Message
                                    key={id}
                                    body={body}
                                    isMessageSent={sender?.id === senderId}
                                />
                            ))}
                        <div ref={messageEndRef} />
                    </div>
                </div>
            </div>
            <form onSubmit={(event) => handleMessageSending(event, scrollToBottom)} className="flex bg-tuna p-[10px]">
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