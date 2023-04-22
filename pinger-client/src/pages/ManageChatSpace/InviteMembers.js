import React, {useEffect, useState} from 'react';
import { Expandable, Loader, useFetchData, useApiAction } from '@Common';
import { useDispatch, useSelector } from 'react-redux';

import Item from './Item';
import { addNotification } from '../../store/slices/notifications';
import getAllUsers from './services/getAllUsers'
import inviteUserToChatSpace from './services/inviteUserToChatSpace'
import getInvitedMembers from './services/getInvitedUsers'
import useSearchChatSpaceMembers from '../Chat/ChannelChat/hooks/useSearchChatSpaceMembers';

const InviteMembers = () => {
    const [users, setUsers] = useState([])
    const dispatch = useDispatch();
    const { userId } = useSelector(state => state.auth)
    const { result: allUsersResult, loaded: allUsersLoaded } = useFetchData(getAllUsers)
    const { result: invitedUsersResult, loaded: invitedUsersLoaded } = useFetchData(getInvitedMembers)
    const { allChatSpaceMembersResult, chatspaceMembersLoaded } = useSearchChatSpaceMembers();
    const { sendAction: sendInviteUserAction, loaded: invitationSent } = useApiAction(
        (userId) => inviteUserToChatSpace(userId)
    )
    const handleInvite = async (userIdToInvite) => {
        const { status } = await sendInviteUserAction(userIdToInvite)

        if(status === 204) {
            setUsers(users.filter(user => user.id !== userIdToInvite))
            dispatch(addNotification({
                notification: "Member was invited",
            }))
        } 
    }

    useEffect(() => {
        if(allUsersResult?.data && invitedUsersResult?.data && allChatSpaceMembersResult?.data) {
            const withoutSelf = allUsersResult.data.filter(user => user.id !== userId)
            const withoutInvited = withoutSelf.filter(u => !invitedUsersResult?.data.some(s => u.id === s.id))
            const withoutJoined = withoutInvited.filter(u => !allChatSpaceMembersResult?.data.some(s => u.id === s.id))

            setUsers(withoutJoined)
        }
    }, [allUsersResult, invitedUsersResult, allChatSpaceMembersResult])

    const loaded = invitedUsersLoaded && allUsersLoaded && chatspaceMembersLoaded;
    const shouldShowInfoMessage = users.length <= 0 && loaded;

    return (
        <Expandable text="Invite users to chatspace">
            <div className="flex flex-col w-full pt-[10px] px-[30px]">
                {users.map(({id, userName}) => (
                    <Item 
                        key={id} 
                        buttonText="Invite"
                        buttonColor="green"
                        onClick={() => handleInvite(id)}
                    >
                        {userName}
                    </Item>
                ))}
                {shouldShowInfoMessage && "There are available users to invite"}
            </div>
            <Loader height={50} loaded={loaded}/>
        </Expandable>
    )
}

export default InviteMembers;