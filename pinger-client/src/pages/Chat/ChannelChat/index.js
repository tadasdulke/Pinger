import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { ChatWindow, DropDown } from '@Components';
import { ReactSVG } from 'react-svg';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { ROUTES } from '@Router';
import {
  useFetchData,
  withErrorWrapper,
  useApiAction,
  useOnScreen,
  ButtonWithLoader
} from '@Common';
import { updateChatType, changeChatOccupierInfo, updateIsAtButton } from '@Store/slices/chat';
import { removeChannelHighlight, removeChannel as removeChannelFromState } from '@Store/slices/channels';
import { uploadChannelMessageFile, getChannel, updateChannelReadTime } from '@Services';
import { useUploadPrivateFiles } from '@Hooks';
import AddUsersToChannel from './components/AddUsersToChannel';
import RemoveUserFromChannel from './components/RemoveUsersFromChannel';
import removeChannelMessage from './services/removeChannelMessage';
import updateChannelMessage from './services/updateChannelMessage'
import removeChannel from './services/removeChannel'
import RemoveChannelConfirmation from './components/RemoveChannelConfirmation';
import useChannelMessages from './hooks/useChannelMessages';

function ChannelChat({ errorHandler }) {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isIntersecting: isAtBottom, initiateObserver } = useOnScreen();
  const [expanded, setExpanded] = useState(false);
  const [messageValue, setMessageValue] = useState('');
  const { userId: currentUserId } = useSelector((state) => state.auth);
  const { channelId } = useParams();
  const convertedChannelId = parseInt(channelId);
  const { connection } = useOutletContext();

  const { sendAction: uploadChannelMessageFileAction } = useApiAction(
    (file, channelId) => uploadChannelMessageFile(file, channelId),
  );
  const { sendAction: updateChannelMessageAction } = useApiAction(
    (messageId, body) => updateChannelMessage(messageId, body),
  );
  const { sendAction: removeChannelMessageAction } = useApiAction(
    (messageId) => removeChannelMessage(messageId),
  );
  const { loaded: channelRemoved, sendAction: removeChannelAction } = useApiAction(
    () => removeChannel(channelId),
  );

  const { sendAction: updateChannelReadTimeAction } = useApiAction(
      () => updateChannelReadTime(channelId),
      errorHandler,
  );

  const { files, uploadFiles, setFiles } = useUploadPrivateFiles(uploadChannelMessageFileAction);

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
  } = useChannelMessages(
    connection, 
    channelId, 
    isAtBottom,
    errorHandler
  );

  const sendMessage = (message, scrollToBottom, setMessageValue) => {
    const allFilesLoaded = files.every(({ loaded }) => loaded === true);

    if (!allFilesLoaded) {
      return;
    }

    const loadedFileIds = files.filter(({ error }) => error === null).map(({ fileId }) => fileId);

    connection.invoke('SendGroupMessage', convertedChannelId, message, loadedFileIds);
    scrollToBottom();
    setFiles([]);
    setMessageValue('');
  };

  const { loaded, result: channelResponse } = useFetchData(
    () => getChannel(channelId),
    errorHandler,
    null,
    [channelId],
  );

  useEffect(() => {
    setExpanded(false);
    setFiles([]);
    setMessageValue('');
  }, [channelId]);

  useEffect(() => {
    dispatch(updateChatType('CHANNEL_CHAT'));
    dispatch(changeChatOccupierInfo({
      channelId: convertedChannelId,
    }));
  }, [channelId]);

  const onIsAtButtonUpdate = (isAtBottom) => {
    dispatch(updateIsAtButton(isAtBottom));
    dispatch(removeChannelHighlight(convertedChannelId));
  };

  const handleMessaageRemove = async (messageId) => {
    const { status, data } = await removeChannelMessageAction(messageId);

    if(status === 200) {
      removeMessage(data);
    }
  };

  const handleMessageEdit = async (editedMessage, { id }) => {
    const { status, data } = await updateChannelMessageAction(id, editedMessage);
    
    if(status === 200) {
      modifyMessage(data);
    }
  };

  const handleChannelRemove = async (toggle) => {
    const { status, data } = await removeChannelAction();
    toggle();
    if(status === 200) {
      dispatch(removeChannelFromState({id: data.id}));
    }
  }

  useEffect(() => {
    (async () => {
      if(isAtBottom) {
        await updateChannelReadTimeAction();
      }
    })();
  }, [isAtBottom])

  useEffect(() => {
    (async () => {
        if(messages && unreadMessages)
        await updateChannelReadTimeAction();

    })();
  }, [messages, unreadMessages])

  return (
    <ChatWindow
      receiverInfo={channelResponse?.data?.name}
      messages={messages}
      unreadMessages={unreadMessages}
      handleMessageSending={sendMessage}
      removeMessage={handleMessaageRemove}
      handleMessageEdit={handleMessageEdit}
      onIsAtButtonUpdate={onIsAtButtonUpdate}
      seeNewMessagesButtonVisible={seeNewMessagesButtonVisible}
      setSeeNewMessagesButtonVisible={setSeeNewMessagesButtonVisible}
      isAtBottom={isAtBottom}
      setMessageValue={setMessageValue}
      messageValue={messageValue}
      messagesLoaded={initialMessagesLoaded}
      initiateObserver={initiateObserver}
      lazyLoadComponent={(
        <div className="flex justify-center mt-[10px]">
          <ButtonWithLoader
            loaded={!additionalMessagesLoading} 
            className={cx({ hidden: !hasMore })}
            onClick={handleAdditionalLoad}
          >
            Load more messages
          </ButtonWithLoader>
        </div>
              )}
      fileDownloadEndpoint="channel-message-file"
      handleFilesUpload={(addedFiles) => uploadFiles(addedFiles, convertedChannelId)}
      files={files}
      setFiles={setFiles}
      chatActions={(
        <DropDown
        loading={!channelRemoved}
          expanded={expanded}
          setExpanded={setExpanded}
          activationElement={(toggle) => (
            <button onClick={toggle}>
              <ReactSVG
                src="http://localhost:5122/public/icons/three-dots-vertical.svg"
                beforeInjection={(svg) => {
                  svg.setAttribute('width', '24px');
                  svg.setAttribute('height', '24px');
                }}
              />
            </button>
          )}
          options={[
            {
              buttonText: 'Add user',
              componentToRender: <AddUsersToChannel />,
            },
            {
              disabled: channelResponse?.data?.owner?.id !== currentUserId,
              buttonText: 'Remove user',
              componentToRender: <RemoveUserFromChannel />,
            },
            {
              disabled: channelResponse?.data?.owner?.id !== currentUserId,
              buttonText: 'Edit channel',
              action: (toggle) => {
                toggle();
                navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.EDIT_CHANNEL}/${channelId}`);
              }
            },
            {
              disabled: channelResponse?.data?.owner?.id !== currentUserId,
              buttonText: 'Remove channel',
              componentToRender: (toggle) => (
                <RemoveChannelConfirmation 
                  removeAction={() => handleChannelRemove(toggle)} 
                  cancelAction={toggle}
                />
              )
            },
          ]}
        />
      )}
    />
  );
}

export default withErrorWrapper(ChannelChat);
