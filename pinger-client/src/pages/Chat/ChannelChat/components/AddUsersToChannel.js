import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Loader } from '@Common';

import useSearchChatSpaceMembers from '../hooks/useSearchChatSpaceMembers'
import useChannelMembers from '../hooks/useChannelMembers';
import useAddUserToChannel from '../hooks/useAddUserToChannel';

function AddUsersToChannel({ toggle }) {
  const { channelId } = useParams();
  const [searchField, setSearchField] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  const { sendAction } = useAddUserToChannel(channelId);
  const { chatspaceMembersLoaded, allChatSpaceMembersResult } = useSearchChatSpaceMembers(searchField);
  const { channelMembersLoaded, channelMembersResult } = useChannelMembers(channelId);
  
  const handleUserAdd = async (id, toggle) => {
    const {status} = await sendAction(id)

    if(status === 204) {
      toggle();
    }
  }

  useEffect(() => {
    if(allChatSpaceMembersResult && channelMembersResult) {
      const membersToAdd = allChatSpaceMembersResult.data.filter(chatSpaceMember => 
        !channelMembersResult.data.find(channelMember => channelMember.id === chatSpaceMember.id)
      );

      setAvailableUsers(membersToAdd)
    }
  }, [allChatSpaceMembersResult, channelMembersResult])



  return (
    <div className="mt-[10px] w-[300px]">
      <Loader
        loaded={chatspaceMembersLoaded && channelMembersLoaded}
        loaderProps={{
          strokeColor: "black"
        }}
      >
        <div className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Type to search for users"
            className="w-full border border-tuna rounded-[3px] p-[8px]"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          />
          <div className="flex flex-col max-h-[300px] overflow-y-auto">
            {availableUsers?.map(({ userName, id }) => (
              <div key={id} className="flex justify-between items-center py-[10px]">
                <span>{userName}</span>
                <Button onClick={() => handleUserAdd(id, toggle)} className="px-[8px] py-[3px]">Add</Button>
              </div>
            ))}
          </div>
        </div>
      </Loader>
    </div>
  );
}

export default AddUsersToChannel;
