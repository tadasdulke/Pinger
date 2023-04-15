import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { ChatWindow, DropDown } from '@Components';
import { ReactSVG } from 'react-svg';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { ROUTES } from '@Router';
import {
  useFetchData,
  useApiAction,
  useOnScreen,
  ButtonWithLoader
} from '@Common';
import { updateChatType, changeChatOccupierInfo, updateIsAtButton, restore } from '@Store/slices/chat';
import { removeChannelHighlight } from '@Store/slices/channels';
import { uploadChannelMessageFile, getChannel, updateChannelReadTime } from '@Services';
import { useUploadPrivateFiles } from '@Hooks';
import AddUsersToChannel from './components/AddUsersToChannel';
import RemoveUserFromChannel from './components/RemoveUsersFromChannel';
import removeChannelMessage from './services/removeChannelMessage';
import updateChannelMessage from './services/updateChannelMessage'
import RemoveChannelConfirmation from './components/RemoveChannelConfirmation';
import useChannelMessages from './hooks/useChannelMessages';
import sendMessage from './utils/sendMessage';
import handleMesaageRemove from './utils/handleMesaageRemove';
import handleMessageEdit from './utils/handleMessageEdit';

function ChannelChat() {
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
    null
  );
  const { sendAction: updateChannelMessageAction } = useApiAction(
    (messageId, body) => updateChannelMessage(messageId, body),
  );
  const { sendAction: removeChannelMessageAction } = useApiAction(
    (messageId) => removeChannelMessage(messageId),
  );

  const { sendAction: updateChannelReadTimeAction } = useApiAction(
      () => updateChannelReadTime(channelId),
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
  );

  const { loaded, result: channelResponse } = useFetchData(
    () => getChannel(channelId),
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

    return () => dispatch(restore())
  }, [channelId]);

  const onIsAtButtonUpdate = (isAtBottom) => {
    dispatch(updateIsAtButton(isAtBottom));
    dispatch(removeChannelHighlight(convertedChannelId));
  };

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

  useEffect(() => {
    const callBack = (channel) => {
      const {id} = channel;

      if(convertedChannelId === id) {
        navigate(ROUTES.USE_CHATSPACE)
      }
    };

    connection.on('UserRemovedFromChannel', callBack);

    return () => {
      connection.off('UserRemovedFromChannel', callBack);
    };
  }, [convertedChannelId]);

  return (
    <ChatWindow
      receiverInfo={channelResponse?.data?.name}
      messages={messages}
      unreadMessages={unreadMessages}
      handleMessageSending={(message, scrollToBottom, setMessageValue) => sendMessage(
        message, 
        scrollToBottom, 
        setMessageValue,
        files,
        connection,
        setFiles,
        convertedChannelId
      )}
      removeMessage={(messageId) => handleMesaageRemove(messageId, removeChannelMessageAction, removeMessage)}
      handleMessageEdit={(editedMessage, messageInfo) => handleMessageEdit(editedMessage, messageInfo, updateChannelMessageAction, modifyMessage)}
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
              componentToRender: (toggle) => <AddUsersToChannel toggle={toggle} />,
            },
            {
              disabled: channelResponse?.data?.owner?.id !== currentUserId,
              buttonText: 'Remove user',
              componentToRender: (toggle) => <RemoveUserFromChannel toggle={toggle} />,
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
                  channelId={channelId}
                  toggle={toggle}
                />
              )
            },
          ]}
        />
      )}
    />
  );
}

export default ChannelChat;
