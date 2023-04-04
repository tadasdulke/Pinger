import { useEffect } from 'react';
import { useApiAction } from '@Common'
import { getChannelMessages, updateChannelReadTime, getUnreadChannelMessages } from '@Services';

import { useMessages } from "../../hooks";

const useChannelMessages = (
    connection, 
    channelId, 
    isAtBottom,
    errorHandler
) => {
    const convertedChannelId = parseInt(channelId);
    const { sendAction: getChannelMessagesAction } = useApiAction(
        (id, offset, step, skip) => getChannelMessages(id, offset, step, skip),
        errorHandler,
    );
  
    const { sendAction: updateChannelReadTimeAction } = useApiAction(
        () => updateChannelReadTime(channelId),
        errorHandler,
    );
  
    const { sendAction: getUnreadChannelMessagesAction } = useApiAction(
        () => getUnreadChannelMessages(channelId),
        errorHandler,
    );

    const {
        messages,
        unreadMessages,
        addMessage,
        modifyMessage,
        removeMessage,
        handleAdditionalLoad,
        initialMessagesLoaded,
        hasMore,
        additionalMessagesLoading,
        setSeeNewMessagesButtonVisible,
        seeNewMessagesButtonVisible,
        addedMessageCount,
        setAddedMessageCount
    } = useMessages(channelId, getChannelMessagesAction, getUnreadChannelMessagesAction);


    useEffect(() => {
        const callBack = async(data) => {
            if (convertedChannelId !== data.channel.id) {
                return;
            }

            addMessage(data);
            setAddedMessageCount(addedMessageCount + 1);
            if (!isAtBottom) {
                setSeeNewMessagesButtonVisible(true);
            }
            if(isAtBottom) {
                await updateChannelReadTimeAction();
            }
        };
    
        connection.on('ReceiveGroupMessage', callBack);
    
        return () => connection.off('ReceiveGroupMessage', callBack);
      }, [convertedChannelId, addedMessageCount, isAtBottom, unreadMessages, messages]);
    
      useEffect(() => {
        const callBack = async (data) => {
            if (convertedChannelId !== data.channel.id) {
                return;
            }
            addMessage(data);
            setAddedMessageCount(addedMessageCount + 1);
            await updateChannelReadTimeAction();
        };
    
        connection.on('GroupMessageSent', callBack);
    
        return () => connection.off('GroupMessageSent', callBack);
      }, [convertedChannelId, unreadMessages, messages]);
    
      useEffect(() => {
        const callBack = (data) => {
            if (convertedChannelId !== data.channel.id) {
                return;
            }
            removeMessage(data)
            setAddedMessageCount(addedMessageCount - 1);
        };
    
        connection.on('RemoveChannelMessage', callBack);
    
        return () => connection.off('RemoveChannelMessage', callBack);
      }, [convertedChannelId, unreadMessages, messages]);
    
      useEffect(() => {
        const callBack = async (data) => {
            if (convertedChannelId !== data.channel.id) {
                return;
            }
            modifyMessage(data)
        };
    
        connection.on('ChannelMessageUpdated', callBack);
    
        return () => connection.off('ChannelMessageUpdated', callBack);
      }, [convertedChannelId, unreadMessages, messages]);
    
    
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

    return {
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
    }
}

export default useChannelMessages;