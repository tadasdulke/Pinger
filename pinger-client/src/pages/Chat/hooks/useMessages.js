import { useState, useEffect } from 'react';

const useMessages = (receiverId, getMessagesAction, getUnreadMessagesAction) => {
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
        const response = await getMessagesAction(receiverId, updatedFetchingOptions.offset, updatedFetchingOptions.step, addedMessageCount);
        setAdditionalMessagesLoading(false);
        setMessages([...response.data.messages, ...messages]);
        setHasMore(response.data.hasMore);
      };
      
    useEffect(() => {
        setHasMore(false);
        setFetchingOptions(defaultFetchingOptions);
        setInitialMessagesLoaded(false);

        (async () => {
            const messagesResponse = await getMessagesAction(receiverId, defaultFetchingOptions.offset, defaultFetchingOptions.step, 0);
            const unreadMessagesResponse = await getUnreadMessagesAction(receiverId);
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

    return {
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
    }

}

export default useMessages;