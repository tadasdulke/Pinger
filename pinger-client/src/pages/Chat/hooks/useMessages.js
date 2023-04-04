import { useState, useEffect } from 'react';
import { useApiAction } from '@Common'
import { getPrivateMessages, updateContactedUserReadTime, getUnreadPrivateMessages } from '@Services';

const useMessages = (connection, receiverId, isAtBottom, errorHandler) => {
    const [messages, setMessages] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState(null);
    const [addedMessageCount, setAddedMessageCount] = useState(0);
    const [seeNewMessagesButtonVisible, setSeeNewMessagesButtonVisible] = useState(false);
    const defaultFetchingOptions = {
        step: 20,
        offset: 0,
      };
    const [fetchingOptions, setFetchingOptions] = useState(defaultFetchingOptions);
    const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [additionalMessagesLoading, setAdditionalMessagesLoading] = useState(false);
    
    const { sendAction: getPrivateMessagesAction } = useApiAction(
        (id, offset, step, skip) => getPrivateMessages(id, offset, step, skip),
        errorHandler,
    );

    const { sendAction: getUnreadPrivateMessagesAction } = useApiAction(
        (id) => getUnreadPrivateMessages(id),
        errorHandler,
    );

    const { sendAction: updateContactedUserReadTimeAction } = useApiAction(
        () => updateContactedUserReadTime(receiverId),
        errorHandler,
    );

    const addMessage = (message) => {
        if(unreadMessages.length > 0) {
            setUnreadMessages([...unreadMessages, message])
        } else {
            setMessages([...messages, message]);
        }
    }

    const modifyMessage = (data) => {
        const foundInMessages = messages.some(m => m.id === data.id);
        const foundInUnread = unreadMessages.some(m => m.id === data.id);

        if(foundInUnread) {
            setUnreadMessages(
                unreadMessages.map((message) => {
                    if (message.id === data.id) {
                      return data;
                    }
            
                    return message;
                })
            )
        } else if(foundInMessages) {
            setMessages(
                messages.map((message) => {
                    if (message.id === data.id) {
                      return data;
                    }
            
                    return message;
                })
            );
        }
    }

    const removeMessage = (data) => {
        const foundInMessages = messages.some(m => m.id === data.id);
        const foundInUnread = unreadMessages.some(m => m.id === data.id);

        if(foundInUnread) {
            setUnreadMessages(unreadMessages.filter((m) => m.id !== data.id));
        } else if(foundInMessages) {
            setMessages(messages.filter((m) => m.id !== data.id));
        }
    }

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
        setFetchingOptions(defaultFetchingOptions);
        setInitialMessagesLoaded(false);

        (async () => {
            const messagesResponse = await getPrivateMessagesAction(receiverId, defaultFetchingOptions.offset, defaultFetchingOptions.step, 0);
            const unreadMessagesResponse = await getUnreadPrivateMessagesAction(receiverId);
            if(messagesResponse.status === 200 && unreadMessagesResponse.status === 200) {
            const {messages, hasMore} = messagesResponse.data;
            const unreadMessages = unreadMessagesResponse.data;
            setMessages(messages);
            setUnreadMessages(unreadMessages);
            setHasMore(hasMore);
            setInitialMessagesLoaded(true);
            setAddedMessageCount(unreadMessages.length)
            }
        })();
    }, [receiverId]);

    useEffect(() => {
        const callBack = async (data) => {
            if(data.receiver.id !== receiverId) {
                return;
            }
            addMessage(data);
            setAddedMessageCount(addedMessageCount + 1);
            await updateContactedUserReadTimeAction();
        };
    
        connection.on('MessageSent', callBack);
    
        return () => connection.off('MessageSent', callBack);
    }, [receiverId, messages, unreadMessages]);


    useEffect(() => {
        const callBack = (data) => {
            if(data.receiver.id !== receiverId) {
                return;
            }
            modifyMessage(data)
        };
    
        connection.on('PrivateMessageUpdated', callBack);
    
        return () => connection.off('PrivateMessageUpdated', callBack);
      }, [receiverId, messages, unreadMessages]);

    useEffect(() => {
        const callBack = (data) => {
            if(data.receiver.id !== receiverId) {
                return;
            }
            removeMessage(data)
            setAddedMessageCount(addedMessageCount - 1);
        }
        connection.on('PrivateMessageRemoved', callBack);
    
        return () => connection.off('PrivateMessageRemoved', callBack);
    }, [receiverId, messages, unreadMessages]);

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
              await updateContactedUserReadTimeAction();
            }
        };
    
        connection.on('ReceiveMessage', callBack);
    
        return () => connection.off('ReceiveMessage', callBack);
      }, [receiverId, messages, unreadMessages, isAtBottom]);

    return {
        messages,
        unreadMessages,
        addedMessageCount,
        modifyMessage,
        removeMessage,
        handleAdditionalLoad,
        initialMessagesLoaded,
        hasMore,
        additionalMessagesLoading,
        setSeeNewMessagesButtonVisible,
        seeNewMessagesButtonVisible,
    }

}

export default useMessages;