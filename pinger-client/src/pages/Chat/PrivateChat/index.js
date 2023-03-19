import React, {useState, useEffect} from 'react';
import { useOutletContext, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useFetchData, withErrorWrapper } from '@Common';
import { changeChatOccupierInfo } from '@Store/slices/chat';
import { ChatWindow } from '@Components'
import getPrivateMessages from './services/getPrivateMessages';
import useFetchChatSpaceMember from './hooks/useFetchChatSpaceMember'

const PrivateChat = ({errorHandler}) => {
    const dispatch = useDispatch();
    const { connection } = useOutletContext();
    const { receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const { member } = useFetchChatSpaceMember(errorHandler, receiverId, null, [receiverId]);
    
    connection.on("ReceiveMessage", data => {
        if(data.sender.id === receiverId) {
            setMessages([...messages, data])
        }
    });

    connection.on("MessageSent", data => {
        setMessages([...messages, data])
    });

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

    useEffect(() => {
        connection.off("ReceiveMessage");
    }, [receiverId])

    const sendMessage = (messageValue) => {
        connection.invoke("SendPrivateMessage", receiverId, messageValue)
    }
    
    const handleSubmit = (event, scrollToBottom) => {
        event.preventDefault();
        sendMessage(event.target.message.value)
        scrollToBottom();
    }

    return (
        <ChatWindow
            receiverName={member?.userName}
            messages={messages}
            handleMessageSending={handleSubmit}
        />
    )
}

export default withErrorWrapper(PrivateChat);