import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { RotatingLines } from 'react-loader-spinner';
import {
  withErrorWrapper, useApiAction, useOnScreen, Button, useLoadedImage,
} from '@Common';
import { changeChatOccupierInfo, updateChatType, updateIsAtButton } from '@Store/slices/chat';
import { ChatWindow } from '@Components';
import { removeUserHighlight } from '@Store/slices/contactedUsers';
import { useUploadPrivateFiles } from '@Hooks';
import { uploadPrivateFile } from '@Services';
import useFetchChatSpaceMember from './hooks/useFetchChatSpaceMember';
import getPrivateMessages from './services/getPrivateMessages';

import useRemovePrivateMessage from './hooks/useRemovePrivateMessage';
import useUpdatePrivateMessage from './hooks/useUpdatePrivateMessage';

function PrivateChat({ errorHandler }) {
  const dispatch = useDispatch();
  const [addedMessageCount, setAddedMessageCount] = useState(0);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const [messageValue, setMessageValue] = useState('');
  const { isIntersecting: isAtBottom, initiateObserver } = useOnScreen();

  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const defaultFetchingOptions = {
    step: 20,
    offset: 0,
  };
  const [fetchingOptions, setFetchingOptions] = useState(defaultFetchingOptions);
  const { connection } = useOutletContext();
  const { receiverId } = useParams();
  const [seeNewMessagesButtonVisible, setSeeNewMessagesButtonVisible] = useState(false);
  const [additionalMessagesLoading, setAdditionalMessagesLoading] = useState(false);
  const { member } = useFetchChatSpaceMember(errorHandler, receiverId, null, [receiverId]);
  const { sendRemoveMessageAction } = useRemovePrivateMessage(errorHandler);
  const { sendUpdateMessageAction } = useUpdatePrivateMessage(errorHandler);
  const { sendAction: uploadPrivateFileAction } = useApiAction(
    (file, receiverId) => uploadPrivateFile(file, receiverId),
  );
  const { files, uploadFiles, setFiles } = useUploadPrivateFiles(uploadPrivateFileAction);

  useEffect(() => {
    setHasMore(false);
    setExpanded(false);
    setFetchingOptions(defaultFetchingOptions);
    setFiles([]);
    setMessageValue('');
  }, [receiverId]);

  useEffect(() => {
    const callBack = (data) => {
      if (data.sender.id === receiverId) {
        setMessages([...messages, data]);
        setAddedMessageCount(addedMessageCount + 1);
        if (!isAtBottom) {
          setSeeNewMessagesButtonVisible(true);
        }
      }
    };

    connection.on('ReceiveMessage', callBack);

    return () => connection.off('ReceiveMessage', callBack);
  }, [receiverId, messages, isAtBottom]);

  useEffect(() => {
    const callBack = (data) => {
      setMessages([...messages, data]);
      setAddedMessageCount(addedMessageCount + 1);
    };

    connection.on('MessageSent', callBack);

    return () => connection.off('MessageSent', callBack);
  }, [messages]);

  useEffect(() => {
    const callBack = (data) => {
      const senderId = data.sender.id;

      if (senderId === receiverId) {
        const messageId = data.id;
        setMessages(messages.filter((m) => m.id !== messageId));
        setAddedMessageCount(addedMessageCount - 1);
      }
    };

    connection.on('PrivateMessageRemoved', callBack);

    return () => connection.off('PrivateMessageRemoved', callBack);
  }, [messages]);

  useEffect(() => {
    const callBack = (data) => {
      const modifiedMessages = messages.map((message) => {
        if (message.id === data.id) {
          return data;
        }

        return message;
      });
      setMessages(modifiedMessages);
    };

    connection.on('PrivateMessageUpdated', callBack);

    return () => connection.off('PrivateMessageUpdated', callBack);
  }, [messages]);

  const { loaded, sendAction: getPrivateMessagesAction } = useApiAction(
    (id, offset, step, skip) => getPrivateMessages(id, offset, step, skip),
    errorHandler,
  );

  const sendMessage = (messageValue, fileIds) => {
    connection.invoke('SendPrivateMessage', receiverId, messageValue, fileIds);
  };

  const handleMessageSending = (message, scrollToBottom, setMessageValue) => {
    const allFilesLoaded = files.every(({ loaded }) => loaded === true);

    if (!allFilesLoaded) {
      return;
    }
    const loadedFileIds = files.filter(({ error }) => error === null).map(({ fileId }) => fileId);

    sendMessage(message, loadedFileIds);
    scrollToBottom();
    setFiles([]);
    setMessageValue('');
  };

  useEffect(() => {
    dispatch(updateChatType('DIRECT_MESSAGE'));
    dispatch(changeChatOccupierInfo({
      userId: receiverId,
    }));
  }, [receiverId]);

  const handleAdditionalLoad = async () => {
    const updatedFetchingOptions = {
      step: 10,
      offset: fetchingOptions.offset + fetchingOptions.step,
    };
    setFetchingOptions(updatedFetchingOptions);
    setAdditionalMessagesLoading(true);
    const response = await getPrivateMessagesAction(receiverId, updatedFetchingOptions.offset, updatedFetchingOptions.step, addedMessageCount);
    setAdditionalMessagesLoading(false);
    setMessages([...response.data.messages, ...messages]);
    setHasMore(response.data.hasMore);
  };

  useEffect(() => {
    setHasMore(false);
    setExpanded(false);
    setFetchingOptions(defaultFetchingOptions);
    setFiles([]);
    setInitialMessagesLoaded(false);
    setMessageValue('');

    (async () => {
      const response = await getPrivateMessagesAction(receiverId, defaultFetchingOptions.offset, defaultFetchingOptions.step, 0);
      setMessages(response.data.messages);
      setHasMore(response.data.hasMore);
      setInitialMessagesLoaded(true);
    })();
  }, [receiverId]);

  const onIsAtButtonUpdate = (isAtBottom) => {
    dispatch(updateIsAtButton(isAtBottom));
    dispatch(removeUserHighlight(receiverId));
  };

  const handleMessageEdit = async (message, { id }) => {
    const editedMessage = message;
    const { status } = await sendUpdateMessageAction(id, editedMessage);

    if (status === 204) {
      const modifiedMessages = messages.map((message) => {
        if (message.id === id) {
          return {
            ...message,
            body: editedMessage,
            edited: true,
          };
        }

        return message;
      });

      setMessages(modifiedMessages);
    }
  };

  const removeMessage = async (id) => {
    const { status } = await sendRemoveMessageAction(id);

    if (status === 204) {
      setMessages(messages.filter((m) => m.id !== id));
    }
  };

  const profileImageSrc = useLoadedImage(
    member?.profilePictureId ? `http://localhost:5122/api/public-file/${member?.profilePictureId}` : null,
    'http://localhost:5122/public/profile-pic.png',
  );

  return (
    <ChatWindow
      receiverInfo={(
        <div className="flex items-center">
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
          <span className="ml-[10px]">{member?.userName}</span>
        </div>
              )}
      expanded={expanded}
      initiateObserver={initiateObserver}
      isAtBottom={isAtBottom}
      messages={messages}
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
      handleMessageSending={handleMessageSending}
      onIsAtButtonUpdate={onIsAtButtonUpdate}
      removeMessage={removeMessage}
      handleMessageEdit={handleMessageEdit}
      handleFilesUpload={(addedFiles) => uploadFiles(addedFiles, receiverId)}
      files={files}
      setFiles={setFiles}
      fileDownloadEndpoint="private-message-file"
      seeNewMessagesButtonVisible={seeNewMessagesButtonVisible}
      setSeeNewMessagesButtonVisible={setSeeNewMessagesButtonVisible}
    />
  );
}

export default withErrorWrapper(PrivateChat);
