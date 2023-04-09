import { useEffect, useState, useCallback } from "react";

const useChatBottom = (
    messages, 
    unreadMessages, 
    isAtBottom, 
    initiateObserver, 
    onIsAtButtonUpdate, 
    setSeeNewMessagesButtonVisible
) => {
    const [messageEndRef, setMessageEndRef] = useState(null);

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [messages, unreadMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messageEndRef]);

    useEffect(() => {
        if (isAtBottom) {
            setSeeNewMessagesButtonVisible(false);
        }

        onIsAtButtonUpdate(isAtBottom);
    }, [isAtBottom]);

    useEffect(() => {
        onIsAtButtonUpdate(isAtBottom);
    }, []);

    const messageEndRefCallback = useCallback((node) => {
        if (node) {
            const ref = { current: node };
            initiateObserver(ref);
            setMessageEndRef(ref);
        }
    }, []);

    const scrollToBottom = (options) => {
        if (messageEndRef) {
            messageEndRef.current?.scrollIntoView(options);
        }
    };

    return {
        scrollToBottom,
        messageEndRefCallback
    }
}

export default useChatBottom;