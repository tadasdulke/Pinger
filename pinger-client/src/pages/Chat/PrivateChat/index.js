import React, {useState, useEffect} from 'react';
import { useOutletContext, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useFetchData, withErrorWrapper } from '@Common';
import { changeChatOccupierInfo } from '@Store/slices/chat';
import { ChatWindow } from '@Components'
import getPrivateMessages from './services/getPrivateMessages';
import useFetchChatSpaceMember from './hooks/useFetchChatSpaceMember'
import { updateChatType, updateIsAtButton } from '@Store/slices/chat';
import { removeUserHighlight } from '@Store/slices/contactedUsers';
import useRemovePrivateMessage from './hooks/useRemovePrivateMessage'
import useUpdatePrivateMessage from './hooks/useUpdatePrivateMessage'

const PrivateChat = ({errorHandler}) => {
    const dispatch = useDispatch();
    const { connection } = useOutletContext();
    const { receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const { member } = useFetchChatSpaceMember(errorHandler, receiverId, null, [receiverId]);
    const { sendRemoveMessageAction } = useRemovePrivateMessage(errorHandler)
    const { sendUpdateMessageAction } = useUpdatePrivateMessage(errorHandler)
    
    useEffect(() => {
        const callBack = (data) => {
            if(data.sender.id === receiverId) {
                setMessages([...messages, data])
            }
        }

        connection.on("ReceiveMessage", callBack);

        return () => connection.off("ReceiveMessage", callBack);
    }, [receiverId, messages])


    useEffect(() => {
        const callBack = data => {
            setMessages([...messages, data])
        }

        connection.on("MessageSent", callBack);

        return () => connection.off("MessageSent", callBack)
    }, [messages])

    useEffect(() => {
        const callBack = data => {
            const senderId = data.sender.id;

            if(senderId === receiverId) {
                const messageId = data.id;
                setMessages(messages.filter(m => m.id !== messageId))
            }
        }

        connection.on("PrivateMessageRemoved", callBack);

        return () => connection.off("PrivateMessageRemoved", callBack)
    }, [messages])

    useEffect(() => {
        const callBack = data => {
            const modifiedMessages = messages.map(message => {
                if(message.id === data.id) {
                    return data;
                }

                return message;
            })

            setMessages(modifiedMessages)
        }

        connection.on("PrivateMessageUpdated", callBack);

        return () => connection.off("PrivateMessageUpdated", callBack)
    }, [messages])

    const { loaded, result } = useFetchData(
        () => getPrivateMessages(receiverId),
        errorHandler,
        null,
        [receiverId]
    )
    
    useEffect(() => {
        if(result && result.data) {
            setMessages(result.data)
        }
    }, [result])

    useEffect(() => {
        if(member) {
            dispatch(changeChatOccupierInfo({
                userId: member.id,
                userName: member.userName
            }))
        }
    }, [member])

    const sendMessage = (messageValue) => {
        connection.invoke("SendPrivateMessage", receiverId, messageValue)
    }
    
    const handleMessageSending = (event, scrollToBottom) => {
        event.preventDefault();
        sendMessage(event.target.message.value)
        scrollToBottom();
    }

    useEffect(() => {
        dispatch(updateChatType("DIRECT_MESSAGE"))
    }, [])

    const onIsAtButtonUpdate = (isAtBottom) => {
        dispatch(updateIsAtButton(isAtBottom))
        dispatch(removeUserHighlight(receiverId))
    }


    const handleMessageEdit = async (event, {id}) => {
        event.preventDefault();
        const editedMessage = event.target.message.value;
        const { status } = await sendUpdateMessageAction(id, editedMessage);

        if(status === 204) {
            const modifiedMessages = messages.map(message => {
                if(message.id === id) {
                    return {
                        ...message,
                        body: editedMessage,
                    }
                }

                return message;
            })

            setMessages(modifiedMessages);
        }
    }

    const removeMessage = async (id) => {
        const { status } = await sendRemoveMessageAction(id);

        if(status === 204) {
            setMessages(messages.filter(m => m.id !== id));
        }
    };

    return (
        <ChatWindow
            receiverName={member?.userName}
            messages={messages}
            handleMessageSending={handleMessageSending}
            onIsAtButtonUpdate={onIsAtButtonUpdate}
            removeMessage={removeMessage}
            handleMessageEdit={handleMessageEdit}
        />
    )
}

export default withErrorWrapper(PrivateChat);