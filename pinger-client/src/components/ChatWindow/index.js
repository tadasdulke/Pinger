import React, { useState, useRef } from 'react';
import { Loader } from '@Common'
import cx from 'classnames';
import Message from '../Message';
import MessageInput from './MessageInput';
import useChatBottom from './hooks/useChatBottom';
import FileList from '../FileList';

import './index.css';

const ChatWindow = ({
  receiverInfo,
  messages,
  unreadMessages,
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
  messageValue,
  setMessageValue,
  messagesLoaded,
  initiateObserver,
  messageFieldHidden,
}) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const scrollRef = useRef();

  const { scrollToBottom, messageEndRefCallback } = useChatBottom(
    messages,
    unreadMessages,
    isAtBottom,
    initiateObserver,
    onIsAtButtonUpdate,
    setSeeNewMessagesButtonVisible
  )


  const initiateEditionMode = (id) => {
    const messageToEdit = messages.find((m) => m.id === id);
    const unreadMessageToEdit = unreadMessages.find((m) => m.id === id);
    
    const message = messageToEdit || unreadMessageToEdit;
    setMessageValue(message.body);
    setSelectedMessage(message);
    setIsEditing(true);
  };

  const handleMessageEditProxy = () => {
    handleMessageEdit(messageValue, selectedMessage);
    setSelectedMessage(null);
    setIsEditing(false);
    setMessageValue('');
  };  

  const handleMessageInputEnter = () => {
    if(isEditing) {
      handleMessageEditProxy();
    } else {
      handleMessageSending(messageValue, scrollToBottom, setMessageValue);
    }
  }

  return (
    <div className="flex justify-between flex-col h-full">
      <div className="flex justify-between bg-tuna p-[20px] text-white">
        {receiverInfo}
        <div className={cx({invisible: !receiverInfo})}>
          {chatActions}
        </div>
      </div>
      <div className="relative h-full">
        {seeNewMessagesButtonVisible && (
            <button
              className="p-[10px] rounded-[5px] absolute bg-tuna z-10 bottom-[20px] left-1/2 translate-x-[-50%] text-white"
              onClick={() => scrollToBottom({ behavior: 'smooth' })}
            >
              See new messages
            </button>
          )}
        <div ref={scrollRef} className="absolute overflow-y-auto bottom-0 top-0 left-0 right-0">
          {!messagesLoaded
            ? (
              <Loader loaderProps={{width: "50"}} />
            )
            : (
              <div className="px-[10px] flex flex-col">
                {lazyLoadComponent}
                {messages?.map((message) => (
                  <Message
                    key={message.id}
                    {...message}
                    removeMessage={removeMessage}
                    initiateEditionMode={initiateEditionMode}
                    fileDownloadEndpoint={fileDownloadEndpoint}
                  />
                ))}
                {unreadMessages && unreadMessages.length > 0 && <>
                <div className="text-green-500 text-center">new messages</div>
                  {unreadMessages?.map((message) => (
                    <Message
                      key={message.id}
                      {...message}
                      removeMessage={removeMessage}
                      initiateEditionMode={initiateEditionMode}
                      fileDownloadEndpoint={fileDownloadEndpoint}
                    />
                  ))}
                </>}
                <div ref={messageEndRefCallback} className="invisible">message end</div>
              </div>
            )}
        </div>
      </div>
      <div className={cx("p-[10px] bg-tuna", {"hidden": messageFieldHidden})}>
        <MessageInput
          handleEnter={handleMessageInputEnter}
          setMessageValue={setMessageValue}
          messageValue={messageValue}
          files={files} 
          handleFilesUpload={handleFilesUpload}
          fileUploadButtonDisabled={isEditing}
        />
        {files?.length > 0 && (
          <FileList fileDownloadEndpoint={fileDownloadEndpoint} setFiles={setFiles} files={files} />
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
