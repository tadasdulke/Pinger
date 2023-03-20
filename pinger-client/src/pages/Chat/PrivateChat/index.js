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

const PrivateChat = ({errorHandler}) => {
    const dispatch = useDispatch();
    const { connection } = useOutletContext();
    const { receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const { member } = useFetchChatSpaceMember(errorHandler, receiverId, null, [receiverId]);
    
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
    
    const handleSubmit = (event, scrollToBottom) => {
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

    return (
        <ChatWindow
            receiverName={member?.userName}
            messages={messages}
            handleMessageSending={handleSubmit}
            onIsAtButtonUpdate={onIsAtButtonUpdate}
        />
    )
}

export default withErrorWrapper(PrivateChat);