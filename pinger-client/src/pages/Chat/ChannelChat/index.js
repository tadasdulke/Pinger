import React, {useEffect, useState} from 'react';
import { useOutletContext, useParams } from 'react-router-dom'
import { ChatWindow } from '@Components'
import { ReactSVG } from 'react-svg';
import { useFetchData, withErrorWrapper } from '@Common'
import { DropDown } from '@Components'
import getChannel from './services/getChannel'
import getChannelMessages from './services/getChannelMessages'
import AddUsersToChannel from './components/AddUsersToChannel'

const ChannelChat = ({errorHandler}) => {
    const [messages, setMessages] = useState([]);
    const [fetchingOptions, setFetchingOptions] = useState({
        step: 50,
        offset: 0,
    });
    const { channelId } = useParams();
    const { connection } = useOutletContext();

    const sendMessage = (event) => {
        event.preventDefault()
        connection.invoke("SendGroupMessage", parseInt(channelId), event.target.message.value)
    }
    
    connection.on("ReceiveGroupMessage", data => {
        setMessages([
            ...messages,
            data
        ]);
    })

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