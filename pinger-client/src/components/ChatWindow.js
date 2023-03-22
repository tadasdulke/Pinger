import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames'
import { useOnScreen } from '@Common'
import { useSelector } from 'react-redux';
import { DropDown } from '@Components'
import { ReactSVG } from 'react-svg';

const Message = ({body, sender, id, removeMessage, initiateEditionMode}) => {
    const { userId } = useSelector(state => state.auth)

    return (
        <div className={cx("p-[10px] mt-[10px] flex justify-between text-white group")}>
            <div className="flex max-w-[90%]">
                <div className="mr-[10px] max-w-[40px] max-h-[40px]">
                    <img src="http://localhost:5122/public/profile-pic.png" width="100%" height="100%"/>
                </div>
                <div className="flex flex-col">
                    <div className="font-medium">
                        {sender?.userName}
                    </div>
                    <div className="break-all">
                        {body}
                    </div>
                </div>
            </div>
            <div className={cx("flex-col hidden", {
                "group-hover:flex": sender.id === userId
            })}>
                <DropDown 
                    activationElement={(toggle) => (
                        <button onClick={toggle}>
                            <ReactSVG 
                                src="http://localhost:5122/public/icons/three-dots-vertical.svg" 
                                beforeInjection={(svg) => {
                                    svg.setAttribute('width', '24px')
                                    svg.setAttribute('height', '24px')
                                }}
                            />
                        </button>
                    )}
                    options={[
                        {
                            buttonText: "Remove",
                            action: (toggle) => {removeMessage(id); toggle()}
                        },
                        {
                            buttonText: "Edit",
                            action: (toggle) => {initiateEditionMode(id); toggle()}
                        },
                    ]}
                />
            </div>
        </div>
    )}

const ChatWindow = ({receiverName, messages, handleMessageSending, chatActions, lazyLoadComponent, onIsAtButtonUpdate, removeMessage, handleMessageEdit}) => {
    const [messageValue, setMessageValue] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [seeNewMessagesButtonVisible, setSeeNewMessagesButtonVisible] = useState(false);
    const messageEndRef = useRef();
    const scrollRef = useRef();
    const isAtBottom = useOnScreen(messageEndRef);

    const scrollToBottom = (options) => {
        messageEndRef.current?.scrollIntoView(options)
    }

    const initiateEditionMode = (id) => {
        const messageToEdit = messages.find(m => m.id === id);
        setMessageValue(messageToEdit.body)
        setSelectedMessage(messageToEdit)
        setIsEditing(true);
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


    const handleMessageEditProxy = (event) => {
        handleMessageEdit(event, selectedMessage)
        setSelectedMessage(null);
        setIsEditing(false);
        setMessageValue('')
    }

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
                                    sender={sender}
                                    id={id}
                                    removeMessage={removeMessage}
                                    initiateEditionMode={initiateEditionMode}
                                />
                            ))}
                        <div ref={messageEndRef} />
                    </div>
                </div>
            </div>
            <form onSubmit={(event) => isEditing ? handleMessageEditProxy(event) : handleMessageSending(event, scrollToBottom)} className="flex bg-tuna p-[10px]">
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