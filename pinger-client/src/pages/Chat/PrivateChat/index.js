import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { RotatingLines } from 'react-loader-spinner';
import {
  useApiAction, 
  useOnScreen, 
  Button, 
  useLoadedImage,
} from '@Common';
import { changeChatOccupierInfo, updateChatType, updateIsAtButton, restore } from '@Store/slices/chat';
import { ChatWindow } from '@Components';
import { removeUserHighlight } from '@Store/slices/contactedUsers';
import { useUploadPrivateFiles } from '@Hooks';
import { uploadPrivateFile, updateContactedUserReadTime } from '@Services';

import useRemovePrivateMessage from './hooks/useRemovePrivateMessage';
import useUpdatePrivateMessage from './hooks/useUpdatePrivateMessage';
import usePrivateMessages from './hooks/usePrivateMessages';
import useFetchContactedUser from './hooks/useFetchContactedUser'
import handleMessageRemove from './utils/handleMessageRemove';
import handleMessageEdit from './utils/handleMessageEdit';
import handleMessageSending from './utils/handleMessageSending'

function PrivateChat() {
  const dispatch = useDispatch();
  const [messageValue, setMessageValue] = useState('');
  const { isIntersecting: isAtBottom, initiateObserver } = useOnScreen();
  const { connection } = useOutletContext();
  const { receiverId } = useParams();
  const [expanded, setExpanded] = useState(false);
  const { contactedUserInfo } = useFetchContactedUser(receiverId, [receiverId]);

  const { sendAction: updateContactedUserReadTimeAction } = useApiAction(
      () => updateContactedUserReadTime(receiverId),
  );

  const {
    messages,
    unreadMessages,
    modifyMessage,
    removeMessage,
    handleAdditionalLoad,
    initialMessagesLoaded,
    hasMore,
    additionalMessagesLoading,
    setSeeNewMessagesButtonVisible,
    seeNewMessagesButtonVisible
  } = usePrivateMessages(
    connection, 
    receiverId, 
    isAtBottom,
  );

  const { sendRemoveMessageAction } = useRemovePrivateMessage();
  const { sendUpdateMessageAction } = useUpdatePrivateMessage();
  const { sendAction: uploadPrivateFileAction } = useApiAction(
    (file, receiverId) => uploadPrivateFile(file, receiverId),
    false
  );
  const { files, uploadFiles, setFiles } = useUploadPrivateFiles(uploadPrivateFileAction);

  const sendMessage = (messageValue, fileIds) => {
    connection.invoke('SendPrivateMessage', receiverId, messageValue, fileIds);
  };

  useEffect(() => {
    dispatch(updateChatType('DIRECT_MESSAGE'));
    dispatch(changeChatOccupierInfo({
      userId: receiverId,
    }));

    return () => dispatch(restore())
  }, [receiverId]);


  useEffect(() => {
    setExpanded(false);
    setFiles([]);
    setMessageValue('');
  }, [receiverId]);

  const onIsAtButtonUpdate = async (isAtBottom) => {
    dispatch(updateIsAtButton(isAtBottom));
    dispatch(removeUserHighlight(receiverId));
  };

  useEffect(() => {
    (async () => {
      if(isAtBottom) {
        await updateContactedUserReadTimeAction();
      }
    })();
  }, [isAtBottom])

  useEffect(() => {
    (async () => {
        if(messages && unreadMessages)
        await updateContactedUserReadTimeAction();

    })();
  }, [messages, unreadMessages])

  const profileImageSrc = useLoadedImage(
    contactedUserInfo?.contactedUser ? `http://localhost:5122/api/public-file/${contactedUserInfo?.contactedUser?.profilePictureId}` : null,
    'http://localhost:5122/public/profile-pic.png',
  );

  return (
    <ChatWindow
      messageFieldHidden={!contactedUserInfo?.existsInChatSpace}
      receiverInfo={(
        <div className={cx("flex items-center ", {hidden: !contactedUserInfo})}>
          <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
            {profileImageSrc && (
            <img
              src={profileImageSrc}
              width="100%"
              height="100%"
              className={cx('rounded-full aspect-square')}
            />
            )}
          </div>
          <span className="ml-[10px]">{contactedUserInfo?.contactedUser?.userName}</span>
          {!contactedUserInfo?.existsInChatSpace && <span className="text-red-500 text-sm ml-[5px]">Deactivated</span>}
        </div>
      )}
      expanded={expanded}
      initiateObserver={initiateObserver}
      isAtBottom={isAtBottom}
      messages={messages}
      unreadMessages={unreadMessages}
      setMessageValue={setMessageValue}
      messageValue={messageValue}
      messagesLoaded={initialMessagesLoaded}
      lazyLoadComponent={(
        <div className="flex justify-center mt-[10px]">
          <Button className={cx('w-auto min-w-[200px] flex justify-center', { hidden: !hasMore })} onClick={handleAdditionalLoad}>
            {additionalMessagesLoading
              ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                />
              )
              : 'Load more messages'}
          </Button>
        </div>
      )}
      handleMessageSending={
        (message, scrollToBottom, setMessageValue) => handleMessageSending(
          message, 
          scrollToBottom, 
          setMessageValue,
          files,
          sendMessage,
          setFiles,
        )
      }
      onIsAtButtonUpdate={onIsAtButtonUpdate}
      removeMessage={(id) => handleMessageRemove(id, sendRemoveMessageAction, removeMessage)}
      handleMessageEdit={(msg, editMsgData) => handleMessageEdit(msg, editMsgData, sendUpdateMessageAction, modifyMessage)}
      handleFilesUpload={(addedFiles) => uploadFiles(addedFiles, receiverId)}
      files={files}
      setFiles={setFiles}
      fileDownloadEndpoint="private-message-file"
      seeNewMessagesButtonVisible={seeNewMessagesButtonVisible}
      setSeeNewMessagesButtonVisible={setSeeNewMessagesButtonVisible}
    />
  );
}

export default PrivateChat;
