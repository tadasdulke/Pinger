import React, {useEffect, useState} from 'react';
import { Expandable, Loader, useFetchData } from '@Common';
import { useDispatch } from 'react-redux';

import Item from './Item';
import { addNotification } from '../../store/slices/notifications';
import getChatSpaceChannels from './services/getChatSpaceChannels';
import useDeleteChannel from '../Chat/ChannelChat/hooks/useDeleteChannel';

const  ManageChatSpaceChannels = () => {
    const [channels, setChannels] = useState([])
    const dispatch = useDispatch();

    const { result: channeslResult, loaded: channelsFetched } = useFetchData(getChatSpaceChannels)
    const { removeChannelAction } = useDeleteChannel();
    
    const handleRemove = async (channelId) => {
        const { status } = await removeChannelAction(channelId)
        
        if(status === 200) {
            setChannels(channels.filter(m => m.id !== channelId))
            dispatch(addNotification({
                notification: "Channel was removed succesfully",
            }))
        }
    }

    useEffect(() => {
        if(channeslResult?.data) {
            setChannels(channeslResult.data)
        }
    }, [channeslResult])

    const shouldShowInfoMessage = channelsFetched && channels.length <= 0;

    return (
        <Expandable text="Manage chatspace channels">
            <Loader height={30} loaded={channelsFetched} />
            <div className="flex flex-col w-full pt-[10px] px-[30px]">
                {channels.map(({id, name}) => (
                    <Item 
                        key={id} 
                        buttonText="Remove" 
                        onClick={() => handleRemove(id)}
                    >
                        {name}
                    </Item>
                ))}
                {shouldShowInfoMessage && "There are no channels in this chatspace"}
            </div>
        </Expandable>
    )
}

export default ManageChatSpaceChannels;