import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames'
import { ROUTES } from '@Router'
import { useFetchData, withErrorWrapper } from "@Common"
import getContactedUsers from './services/getContactedUsers';
import getChannels from './services/getChannels'

const DirectMessageItem = ({to, children, className}) => (
    <Link 
        to={to} 
        className={cx(className, "py-[10px]")}
    >
        {children}
    </Link>
)

const DirectMessages = ({errorHandler, connection}) => {
    const { loaded, result: contactedUsersResult, setData: updateContacterUsers } = useFetchData(
        getContactedUsers,
        errorHandler,
    )

    const { loaded: channelsFetched, result: channelsResult } = useFetchData(
        getChannels,
        errorHandler,
    )
    
    const [contactedUsersWithNewMsg, setContactedUsersWithNewMsg] = useState([]);

    connection.on("NewUserContactAdded", (data) => {
        const userAlreadyExists = contactedUsersResult.data.some(u => u.ContactedUser.id === data.sender.id);
        
        if(!userAlreadyExists) {
            updateContacterUsers(
                [
                    ...contactedUsersResult.data,
                    data
                ]
            )
        }
    })

    connection.on("ReceiveMessage", data => {
        console.log(data)
        setContactedUsersWithNewMsg(
            [
                ...contactedUsersWithNewMsg,
                data.sender.id
            ]
        )
    });


    return (
        <div className="text-white">
            <div className="mb-[20px]">
                <p className="text-left">Channels</p>
                <div className="flex flex-col items-start">
                    {channelsResult && channelsResult.data.map(({name, id}) => (
                        <DirectMessageItem 
                            key={id}
                            to={`${ROUTES.CHANNEL_CHAT}/${id}`}
                        >
                            {name}
                        </DirectMessageItem>
                    ))}                
                    <Link to={ROUTES.CREATE_CHANNEL} className="mt-[5px]">
                        Add channel
                    </Link>
                </div>
            </div>
            <p className="text-left">Direct messages</p>
            <div className="flex items-start flex-col">
                {contactedUsersResult && contactedUsersResult.data.map(({contactedUser: {id, userName}}) => (
                    <DirectMessageItem 
                        key={id}
                        to={`${ROUTES.DIRECT_MESSAGE}/${id}`}
                        className={contactedUsersWithNewMsg.includes(id) && "text-rose-700"}
                    >
                        {userName}
                    </DirectMessageItem>
                ))}
            </div>
        </div>
    )
}

export default withErrorWrapper(DirectMessages);