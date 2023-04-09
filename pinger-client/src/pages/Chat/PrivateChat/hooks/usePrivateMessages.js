import { useEffect } from 'react';
import { useApiAction } from '@Common'
import { getPrivateMessages, getUnreadPrivateMessages, updateContactedUserReadTime } from '@Services';

import { useMessages } from "../../hooks";

const usePrivateMessages = (
    connection, 
    receiverId, 
    isAtBottom,
) => {
    const { sendAction: getPrivateMessagesAction } = useApiAction(
        (id, offset, step, skip) => getPrivateMessages(id, offset, step, skip),
    );
  
    const { sendAction: getUnreadPrivateMessagesAction } = useApiAction(
        (id) => getUnreadPrivateMessages(id),
    );
  
    const { sendAction: updateReadTimeAction } = useApiAction(
        () => updateContactedUserReadTime(receiverId),
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
    } = useMessages(receiverId, getPrivateMessagesAction, getUnreadPrivateMessagesAction);


    useEffect(() => {
        const callBack = async (data) => {
            if(data.receiver.id !== receiverId) {
                return;
            }
            addMessage(data);
            setAddedMessageCount(addedMessageCount + 1);
            await updateReadTimeAction();
        };
    
        connection.on('MessageSent', callBack);
    
        return () => connection.off('MessageSent', callBack);
    }, [receiverId, unreadMessages, messages]);


    useEffect(() => {
        const callBack = (data) => {
            if(data.sender.id !== receiverId) {
                return;
            }
            modifyMessage(data)
        };
    
        connection.on('PrivateMessageUpdated', callBack);
    
        return () => connection.off('PrivateMessageUpdated', callBack);
      }, [receiverId, unreadMessages, messages]);

    useEffect(() => {
        const callBack = (data) => {
            if(data.sender.id !== receiverId) {
                return;
            }
            removeMessage(data)
            setAddedMessageCount(addedMessageCount - 1);
        }
        connection.on('PrivateMessageRemoved', callBack);
    
        return () => connection.off('PrivateMessageRemoved', callBack);
    }, [receiverId, unreadMessages, messages]);

    useEffect(() => {
        const callBack = async (data) => {
            if(data.sender.id !== receiverId) {
                return;
            }

            addMessage(data);
            setAddedMessageCount(addedMessageCount + 1);
            if (!isAtBottom) {
                setSeeNewMessagesButtonVisible(true);
            }
            if(isAtBottom) {
              await updateReadTimeAction();
            }
        };
    
        connection.on('ReceiveMessage', callBack);
    
        return () => connection.off('ReceiveMessage', callBack);
      }, [receiverId, addedMessageCount, isAtBottom, unreadMessages, messages]);

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

export default usePrivateMessages;