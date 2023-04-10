import React from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import {ROUTES} from '@Router'

import UserListItem from './UserListItem';
import useAddContactedUser from './hooks/useAddContactedUser';

const UserList = ({users, onClickItem}) => {
    const navigate = useNavigate();
    const { userId } = useSelector((state) => state.auth);
    const { addContactedUser } = useAddContactedUser();

    const getUsersWithRemovedSelf = () => {
        if (!users) {
          return null;
        }
    
        return users.filter((user) => user.id !== userId);
      };

    const filteredUsers = getUsersWithRemovedSelf();
    
    const onClick = async (id) => {
        onClickItem && onClickItem();
        await addContactedUser(id);
        navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.DIRECT_MESSAGE}/${id}`)
    }

    return (
        <>
            {filteredUsers?.length > 0 && <p className="text-white text-center">Members</p>}
            {filteredUsers?.map(({userName, profilePictureId, id}) => 
                <UserListItem
                    key={id}
                    userName={userName}
                    profilePictureId={profilePictureId}
                    onClick={() => onClick(id)}
                />
            )}
        </>
    )
}

export default UserList;