import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { getUnreadPrivateMessages } from '@Services';
import { useFetchData, useApiAction, Loader } from '@Common'
import { addContactedUser, highlightUser } from '@Store/slices/contactedUsers';
import ContactedUserItem from './ContactedUserItem';
import getContactedUsers from '../../services/getContactedUsers';

import ListItem from '../ListItem';

const ContactedUsersList = ({connection}) => {
    const dispatch = useDispatch();
    const { users: contactedUsers } = useSelector((state) => state.contactedUsers);
    const { occupierInfo: chatOccupierInfo, isAtButton } = useSelector((state) => state.chat);


    const { result: contactedUsersResult, loaded: contactedUsersLoaded } = useFetchData(
        getContactedUsers,
    );

    const { sendAction: getUnreadPrivateMessagesAction } = useApiAction(
        (id) => getUnreadPrivateMessages(id),
      );

    const checkForUnreadMessages = async (contactedUsers) => {
        const unreadMsgs = await Promise.all(contactedUsers.map(({contactedUser}) => getUnreadPrivateMessagesAction(contactedUser.id)));
        unreadMsgs.forEach((unreadMsg, index) => {
          if(unreadMsg.data.unreadMessages.length > 0 || !unreadMsg.data.alreadyInteracted) {
            dispatch(highlightUser(contactedUsers[index].contactedUser.id));
          }
        })
      }
    
    useEffect(() => {
    if (contactedUsersResult && contactedUsersResult.data) {
        contactedUsersResult.data.forEach(({ contactedUser }) => {
          dispatch(addContactedUser(contactedUser));
        });

        (async () => {
          await checkForUnreadMessages(contactedUsersResult.data); 
      })();
    }
    }, [contactedUsersResult]);

    useEffect(() => {
        const callBack = (data) => {
          dispatch(addContactedUser(data.contactedUser));
        };
    
        connection.on('NewUserContactAdded', callBack);
    
        return () => connection.off('NewUserContactAdded', callBack);
    }, []);

    useEffect(() => {
        const callBack = (data) => {
          const senderId = data.sender.id;
          const isSenderCurrentlyInMessaging = chatOccupierInfo.userId === senderId;
          if (!isSenderCurrentlyInMessaging) {
            dispatch(highlightUser(senderId));
          }
    
          if (isSenderCurrentlyInMessaging && !isAtButton) {
            dispatch(highlightUser(senderId));
          }
        };
    
        connection.on('ReceiveMessage', callBack);
    
        return () => {
          connection.off('ReceiveMessage', callBack);
        };
    }, [chatOccupierInfo.userId, isAtButton]);

    return (
        <>
          <div className="flex items-center text-left px-[5px]">
                <ReactSVG
                    src="http://localhost:5122/public/icons/direct-message.svg"
                    beforeInjection={(svg) => {
                      svg.setAttribute('width', '24px');
                      svg.setAttribute('height', '24px');
                    }}  
                />
              <span className="ml-[10px] py-[10px]">Private messages</span>
              </div>
              <div className="flex items-start flex-col">
                <Loader height={30} loaded={contactedUsersLoaded} />
                {contactedUsers.map(({
                    id, userName, profilePictureId, highlighted,
                }) => (
                    <ContactedUserItem
                        key={id}
                        id={id}
                        userName={userName}
                        profilePictureId={profilePictureId}
                        highlighted={highlighted} 
                    />
                ))}
                <ListItem to="chatspace-users">
                  <div className="flex items-center text-left">
                    <ReactSVG
                      src="http://localhost:5122/public/icons/users.svg"
                      beforeInjection={(svg) => {
                        svg.setAttribute('width', '24px');
                        svg.setAttribute('height', '24px');
                      }}  
                    />
                    <span className="ml-[10px]">See all users</span>
                  </div>
                </ListItem>
            </div>
        </>
    )
}

export default ContactedUsersList;