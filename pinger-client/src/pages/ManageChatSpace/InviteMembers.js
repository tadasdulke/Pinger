import React, {useEffect, useState} from 'react';
import { Expandable, Loader, useFetchData } from '@Common';
import { useDispatch, useSelector } from 'react-redux';

import Item from './Item';
import { addNotification } from '../../store/slices/notifications';
import getAllUsers from './services/getAllUsers'

const InviteMembers = () => {
    const [users, setUsers] = useState([])
    const dispatch = useDispatch();
    const { userId } = useSelector(state => state.auth)
    // const { chatSpaceMembersLoaded, chatSpaceMembersResult } = useFetchChatSpaceMembers();
    
    const { result: allUsersResult, loaded: allUsersLoaded } = useFetchData(getAllUsers)
    // const { sendAction: sendRemoveUserAction } = useApiAction(
    //     (memberId) => removeChatSpaceMember(memberId)
    // )
    
    // const handleRemove = async (memberId) => {
    //     const { status } = await sendRemoveUserAction(memberId)

    //     if(status === 200) {
    //         setMembers(members.filter(m => m.id !== memberId))
    //         dispatch(addNotification({
    //             notification: "Members was removed succesfully",
    //         }))
    //     }
    // }

    useEffect(() => {
        if(allUsersResult?.data) {
            const filteredMembers = allUsersResult.data.filter(user => user.id !== userId)
            setUsers(filteredMembers)
        }
    }, [allUsersResult])

    return (
        <Expandable text="Invite users to chatspace">
            <Loader loaded={allUsersLoaded}>
                <div className="flex flex-col w-full pt-[10px] px-[30px]">
                    {users.map(({id, userName}) => (
                        <Item 
                            key={id} 
                            buttonText="Remove" 
                            onClick={() => handleRemove(id)}
                        >
                            {userName}
                        </Item>
                    ))}
                    {users.length <= 0 && "There are no users"}
                </div>
            </Loader>
        </Expandable>
    )
}

export default InviteMembers;