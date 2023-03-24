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
import { updateChatType, changeChatOccupierInfo, updateIsAtButton } from '@Store/slices/chat';
import { removeChannelHighlight } from '@Store/slices/channels';


const ChannelChat = ({errorHandler}) => {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [fetchingOptions, setFetchingOptions] = useState({
        step: 50,
        offset: 0,
    });
    const { channelId } = useParams();
    const convertedChannelId = parseInt(channelId)
    const { connection } = useOutletContext();

    const sendMessage = (message, scrollToBottom) => {
        connection.invoke("SendGroupMessage", convertedChannelId, message)
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
    
    useEffect(() => {
        const callBack = (data) => {
            setMessages([
                ...messages,
                data
            ]);
        }

        connection.on("GroupMessageSent", callBack);

        return () => connection.off("GroupMessageSent", callBack);
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
            step: 10,
            offset: fetchingOptions.offset + fetchingOptions.step, 
        })
    }

    const { sendAction: updateReadTime } =  useApiAction(
        () => updateChannelMessageReadTime(convertedChannelId),
        errorHandler
    )

    useEffect(() => {
        dispatch(updateChatType('CHANNEL_CHAT'))
        dispatch(changeChatOccupierInfo({
            channelId: convertedChannelId
        }))
    }, [])


    const onIsAtButtonUpdate = (isAtBottom) => {
        dispatch(updateIsAtButton(isAtBottom))
        dispatch(removeChannelHighlight(convertedChannelId))
    }


    return ( 
        <ChatWindow
            receiverName={result?.data?.name}
            messages={messages}
            handleMessageSending={sendMessage}
            onIsAtButtonUpdate={onIsAtButtonUpdate}
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