import React from 'react';
import { useFetchData, withErrorWrapper } from "@Common"
import getContactedUsers from './services/getContactedUsers';
import { useDispatch, useSelector } from 'react-redux';
import { changeChatOccupierInfo } from '@Store/slices/chat';

const DirectMessageItem = ({userName, onClick}) => (
    <button onClick={onClick} className="py-[10px]">
        {userName}
    </button>
)

const DirectMessages = ({errorHandler}) => {
    const {occupierInfo} = useSelector(state => state.chat)
    const dispatch = useDispatch();

    const { loaded, result } = useFetchData(
        getContactedUsers,
        errorHandler,
        null,
        [occupierInfo]
    )

    const onClick = (userId, userName) => {
        dispatch(changeChatOccupierInfo({
            userId,
            userName
        }));
    }

    return (
        <div className="text-white">
            <p className="text-left">Direct messages</p>
            <div className="flex items-start flex-col">
                {result && result.data.map(({contactedUser: {id, userName}}) => (
                    <DirectMessageItem 
                        key={id} 
                        userName={userName} 
                        onClick={() => onClick(id, userName)}
                    />
                ))}
            </div>
        </div>
    )
}

export default withErrorWrapper(DirectMessages);