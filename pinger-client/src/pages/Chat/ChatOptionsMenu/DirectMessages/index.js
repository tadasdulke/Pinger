import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '@Router'
import { useFetchData, withErrorWrapper } from "@Common"
import getContactedUsers from './services/getContactedUsers';
import getChannels from './services/getChannels'
import { addContactedUser, highlightUser } from '@Store/slices/contactedUsers';
import { addChannel } from '@Store/slices/channels';

const DirectMessageItem = ({to, children, className}) => (
    <Link 
        to={to} 
        className={cx(className, "py-[10px]")}
    >
        {children}
    </Link>
)

const DirectMessages = ({errorHandler, connection}) => {
    const dispatch = useDispatch();
    const {users: contactedUsers} = useSelector(state => state.contactedUsers)
    const { channels } = useSelector(state => state)
    const { occupierInfo: chatOccupierInfo, isAtButton } = useSelector(state => state.chat)
    const { loaded, result: contactedUsersResult } = useFetchData(
        getContactedUsers,
        errorHandler,
    )

    const { loaded: channelsFetched, result: channelsResult } = useFetchData(
        getChannels,
        errorHandler,
    )

    useEffect(() => {
        if(contactedUsersResult && contactedUsersResult.data) {
            contactedUsersResult.data.forEach(({contactedUser}) => {
                dispatch(addContactedUser(contactedUser))
            })
        }
    }, [contactedUsersResult])

    useEffect(() => {
        if(channelsResult && channelsResult.data) {
            channelsResult.data.forEach((channel) => {
                dispatch(addChannel(channel))
            })
        }
    }, [channelsResult])
    

    // put this in useeffect
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

    useEffect(() => {
        const callBack = (data) => {
            const senderId = data.sender.id;
            const isSenderCurrentlyInMessaging = chatOccupierInfo.userId === senderId;
            console.log(isAtButton)
            if(!isSenderCurrentlyInMessaging) {
                dispatch(highlightUser(senderId))
            }

            if(isSenderCurrentlyInMessaging && !isAtButton) {
                dispatch(highlightUser(senderId))
            }
        }

        if(chatOccupierInfo.userId) {
            connection.on("ReceiveMessage", callBack);
        }

        return () => {
            connection.off("ReceiveMessage", callBack)
        }

    }, [chatOccupierInfo.userId, isAtButton])


    return (
        <div className="text-white">
            <div className="mb-[20px]">
                <p className="text-left">Channels</p>
                <div className="flex flex-col items-start">
                    {channels.map(({name, id, highlighted}) => (
                        <DirectMessageItem 
                            key={id}
                            to={`${ROUTES.CHANNEL_CHAT}/${id}`}
                            className={highlighted && "text-rose-700"}
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
                {contactedUsers.map(({id, userName, highlighted}) => (
                    <DirectMessageItem 
                        key={id}
                        to={`${ROUTES.DIRECT_MESSAGE}/${id}`}
                        className={highlighted && "text-rose-700"}
                    >
                        {userName}
                    </DirectMessageItem>
                ))}
            </div>
        </div>
    )
}

export default withErrorWrapper(DirectMessages);