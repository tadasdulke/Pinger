import React, {useEffect, useState} from 'react';
import {Expandable, Loader, useApiAction } from '@Common';
import { useDispatch, useSelector } from 'react-redux';

import removeChatSpaceMember from './services/removeChatSpaceMember'
import useFetchChatSpaceMembers from '../Chat/UserSearch/UserSearchModal/hooks/useFetchChatSpaceMembers';
import Item from './Item';
import { addNotification } from '../../store/slices/notifications';

const  ManageChatSpaceMembers = () => {
    const [members, setMembers] = useState([])
    const dispatch = useDispatch();
    const { userId } = useSelector(state => state.auth)
    const { chatSpaceMembersLoaded, chatSpaceMembersResult } = useFetchChatSpaceMembers();
    
    const { sendAction: sendRemoveUserAction } = useApiAction(
        (memberId) => removeChatSpaceMember(memberId)
    )
    
    const handleRemove = async (memberId) => {
        const { status } = await sendRemoveUserAction(memberId)

        if(status === 200) {
            setMembers(members.filter(m => m.id !== memberId))
            dispatch(addNotification({
                notification: "Members was removed succesfully",
            }))
        }
    }

    useEffect(() => {
        if(chatSpaceMembersResult?.data) {
            const filteredMembers = chatSpaceMembersResult.data.filter(member => member.id !== userId)
            setMembers(filteredMembers)
        }
    }, [chatSpaceMembersResult])

    const shouldShowInfoMessage = chatSpaceMembersLoaded && members.length <= 0;

    return (
        <Expandable text="Manage chatspace members">
            <Loader height={30} loaded={chatSpaceMembersLoaded}/>
            <div className="flex flex-col w-full pt-[10px] px-[30px]">
                {members.map(({id, userName}) => (
                    <Item 
                        key={id} 
                        buttonText="Remove" 
                        onClick={() => handleRemove(id)}
                    >
                        {userName}
                    </Item>
                ))}
                {shouldShowInfoMessage && "There are no members in this chatspace"}
            </div>
        </Expandable>
    )
}

export default ManageChatSpaceMembers;