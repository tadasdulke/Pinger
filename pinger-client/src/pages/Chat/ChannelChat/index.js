import React from 'react';
import { useOutletContext, useParams } from 'react-router-dom'
import { ChatWindow } from '@Components'
import { useFetchData, withErrorWrapper } from '@Common'

import getChannel from './services/getChannel'

const ChannelChat = ({errorHandler}) => {
    const { channelId } = useParams();
    const { connection } = useOutletContext();

    const sendMessage = (event) => {
        event.preventDefault()
        connection.invoke("SendGroupMessage", '1-kanalas', event.target.message.value)
    }

    connection.on("ReceiveGroupMessage", (data) => {
        console.log(data)
    })
    

    const { loaded, result } = useFetchData(
        () => getChannel(channelId),
        errorHandler
    )

    console.log(result)

    return ( 
        <ChatWindow
            receiverName={result?.data?.name}
            messages={[]}
            handleMessageSending={sendMessage}
        />
    )
}

export default withErrorWrapper(ChannelChat);