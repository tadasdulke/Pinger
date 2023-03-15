import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTES } from '@Router'
import { useFetchData, withErrorWrapper } from "@Common"
import getContactedUsers from './services/getContactedUsers';
import getChannels from './services/getChannels'

const DirectMessageItem = ({id, userName}) => (
    <Link 
        to={`${ROUTES.DIRECT_MESSAGE}/${id}`} 
        className="py-[10px]">
        {userName}
    </Link>
)

const DirectMessages = ({errorHandler}) => {
    const {occupierInfo} = useSelector(state => state.chat)

    const { loaded, result } = useFetchData(
        getContactedUsers,
        errorHandler,
        null,
        [occupierInfo]
    )

    const { loaded: channelsFetched, result: channelsResult } = useFetchData(
        getChannels,
        errorHandler,
    )

    return (
        <div className="text-white">
            <div className="mb-[20px]">
                <p className="text-left">Channels</p>
                <div className="flex flex-col items-start">
                    {channelsResult && channelsResult.data.map(({name, id}) => (
                        <DirectMessageItem 
                            key={id}
                            id={id} 
                            userName={name} 
                        />
                    ))}                
                    <Link to={ROUTES.CREATE_CHANNEL} className="mt-[5px]">
                        Add channel
                    </Link>
                </div>
            </div>
            <p className="text-left">Direct messages</p>
            <div className="flex items-start flex-col">
                {result && result.data.map(({contactedUser: {id, userName}}) => (
                    <DirectMessageItem 
                        key={id}
                        id={id} 
                        userName={userName} 
                    />
                ))}
            </div>
        </div>
    )
}

export default withErrorWrapper(DirectMessages);