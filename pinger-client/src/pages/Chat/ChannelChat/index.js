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
import { uploadChannelMessageFile, getChannel } from '@Services';
import { useUploadPrivateFiles } from '@Hooks';
import getChannelMessages from './services/getChannelMessages';
import AddUsersToChannel from './components/AddUsersToChannel';
import RemoveUserFromChannel from './components/RemoveUsersFromChannel';
import removeChannelMessage from './services/removeChannelMessage';
import updateChannelMessage from './services/updateChannelMessage'
import removeChannel from './services/removeChannel'
import RemoveChannelConfirmation from './components/RemoveChannelConfirmation';

function ChannelChat({ errorHandler }) {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seeNewMessagesButtonVisible, setSeeNewMessagesButtonVisible] = useState(false);
  const { isIntersecting: isAtBottom, initiateObserver } = useOnScreen();
  const [addedMessageCount, setAddedMessageCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [additionalMessagesLoading, setAdditionalMessagesLoading] = useState(false);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageValue, setMessageValue] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const { userId: currentUserId } = useSelector((state) => state.auth);
  const defaultFetchingOptions = {
    step: 20,
    offset: 0,
  };
  const [fetchingOptions, setFetchingOptions] = useState(defaultFetchingOptions);
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
  const { files, uploadFiles, setFiles } = useUploadPrivateFiles(uploadChannelMessageFileAction);

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

  useEffect(() => {
    const callBack = (data) => {
      if (convertedChannelId === data.channel.id) {
        setMessages([
          ...messages,
          data,
        ]);
        setAddedMessageCount(addedMessageCount + 1);
        if (!isAtBottom) {
          setSeeNewMessagesButtonVisible(true);
        }
      }
    };

    connection.on('ReceiveGroupMessage', callBack);

    return () => connection.off('ReceiveGroupMessage', callBack);
  }, [messages, isAtBottom, convertedChannelId]);

  useEffect(() => {
    const callBack = (data) => {
      setMessages([
        ...messages,
        data,
      ]);
      setAddedMessageCount(addedMessageCount + 1);
    };

    connection.on('GroupMessageSent', callBack);

    return () => connection.off('GroupMessageSent', callBack);
  }, [messages]);

  useEffect(() => {
    const callBack = (data) => {
      const messageId = data.id;
      setMessages(messages.filter((message) => message.id !== messageId));
      setAddedMessageCount(addedMessageCount - 1);
    };

    connection.on('RemoveChannelMessage', callBack);

    return () => connection.off('GroupMessageSent', callBack);
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

    connection.on('ChannelMessageUpdated', callBack);

    return () => connection.off('ChannelMessageUpdated', callBack);
  }, [messages]);


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
  }, [channelId]);

  const { loaded, result: channelResponse } = useFetchData(
    () => getChannel(channelId),
    errorHandler,
    null,
    [channelId],
  );

  const { sendAction: getChannelMessagesAction } = useApiAction(
    (id, offset, step, skip) => getChannelMessages(id, offset, step, skip),
    errorHandler,
  );

  const handleAdditionalLoad = async () => {
    const updatedFetchingOptions = {
      step: 10,
      offset: fetchingOptions.offset + fetchingOptions.step,
    };
    setFetchingOptions(updatedFetchingOptions);
    setAdditionalMessagesLoading(true);
    const response = await getChannelMessagesAction(channelId, updatedFetchingOptions.offset, updatedFetchingOptions.step, addedMessageCount);
    setAdditionalMessagesLoading(false);
    setMessages([...response.data.messages, ...messages]);
    setHasMore(response.data.hasMore);
  };

  useEffect(() => {
    setHasMore(false);
    setExpanded(false);
    setInitialMessagesLoaded(false);
    setFetchingOptions(defaultFetchingOptions);
    setFiles([]);
    setAddedMessageCount(0);
    setMessageValue('');

    (async () => {
      const response = await getChannelMessagesAction(channelId, defaultFetchingOptions.offset, defaultFetchingOptions.step, 0);
      setMessages(response.data.messages);
      setHasMore(response.data.hasMore);
      setInitialMessagesLoaded(true);
    })();
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

  const removeMessage = async (messageId) => {
    const { status } = await removeChannelMessageAction(messageId);

    if (status === 204) {
      setMessages(messages.filter((m) => m.id !== messageId));
      setAddedMessageCount(addedMessageCount - 1);
    }
  };

  const handleMessageEdit = async (editedMessage, { id }) => {
    const { status } = await updateChannelMessageAction(id, editedMessage);

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

  const handleChannelRemove = async (toggle) => {
    const { status, data } = await removeChannelAction();
    toggle();
    if(status === 200) {
      dispatch(removeChannelFromState({id: data.id}));
    }
  }

  return (
    <ChatWindow
      receiverInfo={channelResponse?.data?.name}
      messages={messages}
      handleMessageSending={sendMessage}
      removeMessage={removeMessage}
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
