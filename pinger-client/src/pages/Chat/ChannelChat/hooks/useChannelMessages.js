import { useEffect } from 'react';
import { useApiAction } from '@Common'
import { getChannelMessages, updateChannelReadTime, getUnreadChannelMessages } from '@Services';

import { useMessages } from "../../hooks";

const useChannelMessages = (
    connection, 
    channelId, 
    isAtBottom,
) => {
    const convertedChannelId = parseInt(channelId);
    const { sendAction: getChannelMessagesAction } = useApiAction(
        (id, offset, step, skip) => getChannelMessages(id, offset, step, skip),
    );
  
    const { sendAction: updateChannelReadTimeAction } = useApiAction(
        () => updateChannelReadTime(channelId),
    );
  
    const { sendAction: getUnreadChannelMessagesAction } = useApiAction(
        () => getUnreadChannelMessages(channelId),
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