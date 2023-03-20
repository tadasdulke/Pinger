import React, {useEffect, useState} from 'react';
import { useOutletContext, useParams } from 'react-router-dom'
import { ChatWindow } from '@Components'
import { ReactSVG } from 'react-svg';
import { useDispatch } from 'react-redux';
import { useFetchData, withErrorWrapper, useApiAction } from '@Common'
import { DropDown } from '@Components'
import getChannel from './services/getChannel'
import getChannelMessages from './services/getChannelMessages'
import AddUsersToChannel from './components/AddUsersToChannel'
import updateChannelMessageReadTime from './services/updateChannelMessageReadTime'
import { updateChatType, changeChatOccupierInfo } from '@Store/slices/chat';


const ChannelChat = ({errorHandler}) => {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [fetchingOptions, setFetchingOptions] = useState({
        step: 50,
        offset: 0,
    });
    const { channelId } = useParams();
    const { connection } = useOutletContext();

    const sendMessage = (event, scrollToBottom) => {
        event.preventDefault()
        connection.invoke("SendGroupMessage", parseInt(channelId), event.target.message.value)
        scrollToBottom();
    }
    
    useEffect(() => {
        const callBack = (data) => {
            setMessages([
                ...messages,
                data
            ]);
        }

        connection.on("ReceiveGroupMessage", callBack);

        return () => connection.off("ReceiveGroupMessage", callBack);
    }, [messages])

    const { loaded, result } = useFetchData(
        () => getChannel(channelId),
        errorHandler
    )

    const { result: channelMessagesResult } = useFetchData(
        () => getChannelMessages(channelId, fetchingOptions.offset, fetchingOptions.step),
        errorHandler,
        null,
        [fetchingOptions]
    )

    useEffect(() => {
        if(channelMessagesResult && channelMessagesResult.data) {
            setMessages([...channelMessagesResult.data, ...messages])
        }

    }, [channelMessagesResult])


    const handleAdditionalLoad = () => {
        setFetchingOptions({
            step: 50,
            offset: fetchingOptions.offset + 50, 
        })
    }

    const { sendAction: updateReadTime } =  useApiAction(
        () => updateChannelMessageReadTime(channelId),
        errorHandler
    )

    useEffect(() => {
        dispatch(updateChatType('CHANNEL_CHAT'))
        dispatch(changeChatOccupierInfo({
            channelId
        }))
    }, [])

    return ( 
        <ChatWindow
            receiverName={result?.data?.name}
            messages={messages}
            handleMessageSending={sendMessage}
            lazyLoadComponent={
                <button onClick={handleAdditionalLoad}>
                    load more
                </button>
            }
            chatActions={
                <>
                    <DropDown 
                        activationElement={(toggle) => (
                            <button onClick={toggle}>
                                <ReactSVG 
                                    src="http://localhost:5122/public/icons/three-dots-vertical.svg" 
                                    beforeInjection={(svg) => {
                                        svg.setAttribute('width', '24px')
                                        svg.setAttribute('height', '24px')
                                    }}
                                />
                            </button>
                        )}
                        options={[
                            {
                                svg: {
                                    src: "http://localhost:5122/public/icons/add-user.svg"
                                },
                                buttonText: "Add user",
                                componentToRender: <AddUsersToChannel connection={connection}/>
                            },
                        ]}
                    />
                </>
            }
        />
    )
}

export default withErrorWrapper(ChannelChat);