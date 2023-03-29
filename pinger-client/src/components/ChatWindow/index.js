import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames'
import { ReactSVG } from 'react-svg';
import InputEmoji from 'react-input-emoji'
import { useSelector } from 'react-redux';
import { useOnScreen } from '@Common'
import { DropDown, FileUploadButton, FileList } from '@Components'

import './index.css'

const Message = ({body, sender, id, removeMessage, initiateEditionMode, edited, files, fileDownloadEndpoint}) => {
    const [profileImageLoaded, setProfileImageLoaded] = useState(false);
    const { userId } = useSelector(state => state.auth)
    const [expanded, setExpanded] = useState(false);

    const profileImage = sender.profilePictureId ? `http://localhost:5122/api/public-file/${sender.profilePictureId}` : "http://localhost:5122/public/profile-pic.png"

    return (
        <div 
            className={cx("p-[10px] mt-[10px] flex justify-between text-white group")} 
            onMouseLeave={() => setExpanded(false)}
        >
            <div className="flex max-w-[90%]">
                <div className="mr-[10px] max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]">
                    <img 
                        src={profileImage}
                        width="100%" 
                        height="100%" 
                        className={cx("rounded-full aspect-square", {
                            hidden: !profileImageLoaded
                        })}
                        onLoad={() => setProfileImageLoaded(true)}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <span className="font-medium mr-[5px]">{sender?.userName}</span>
                        {edited && <span className="text-xs">(Edited)</span>}
                    </div>
                    <div className="break-words">
                        {body}
                    </div>
                    {files?.map(({id, name}) => (
                        <div key={id} className="flex items-center">
                            <ReactSVG 
                                src="http://localhost:5122/public/icons/file.svg" 
                                beforeInjection={(svg) => {
                                    svg.setAttribute('width', '24px')
                                    svg.setAttribute('height', '24px')
                                }}
                            />
                            <a href={`http://localhost:5122/api/${fileDownloadEndpoint}/${id}`} target="_blank" download={name} className="text-white break-all hover:text-slate-300 ml-[10px]">{name}</a>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cx("flex-col hidden", {
                "group-hover:flex": sender.id === userId
            })}>
                <DropDown
                    expanded={expanded}
                    setExpanded={setExpanded}
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

const ChatWindow = ({
    receiverName, 
    messages, 
    handleMessageSending, 
    chatActions, 
    lazyLoadComponent, 
    onIsAtButtonUpdate, 
    removeMessage, 
    handleMessageEdit,
    handleFilesUpload,
    files,
    setFiles,
    fileDownloadEndpoint,
    seeNewMessagesButtonVisible,
    setSeeNewMessagesButtonVisible,
    isAtBottom,
    messageEndRef
}) => {
    const [messageValue, setMessageValue] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const scrollRef = useRef();

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


    const handleMessageEditProxy = () => {
        handleMessageEdit(messageValue, selectedMessage)
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
                            {messages.map((message) => (
                                <Message
                                    key={message.id}
                                    {...message}
                                    removeMessage={removeMessage}
                                    initiateEditionMode={initiateEditionMode}
                                    fileDownloadEndpoint={fileDownloadEndpoint}
                                />
                            ))}
                        <div ref={messageEndRef} />
                    </div>
                </div>
            </div>
            <div className="p-[10px] bg-tuna">
                <div className="flex items-center">
                    <InputEmoji
                        value={messageValue}
                        onChange={setMessageValue}
                        cleanOnEnter
                        borderRadius={5}
                        onEnter={isEditing ? handleMessageEditProxy : () => handleMessageSending(messageValue, scrollToBottom, setMessageValue)}
                        placeholder="Type a message"
                    />
                    {!isEditing &&
                        <FileUploadButton
                            files={files}
                            uploadFiles={handleFilesUpload}
                        />
                    }
                </div>
                {files?.length > 0 && (
                    <FileList setFiles={setFiles} files={files}  />  
                )}
            </div>
        </div>
    )
}

export default ChatWindow;