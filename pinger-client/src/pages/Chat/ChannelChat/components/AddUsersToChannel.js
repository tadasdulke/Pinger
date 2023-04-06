import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, useFetchData, useApiAction, withErrorWrapper,
} from '@Common';
import { searchChatSpaceMembers, getChannelMembers } from '@Services';
import addUserToChannel from '../services/addUserToChannel';

function AddUsersToChannel({ errorHandler, toggle }) {
  const { channelId } = useParams();
  const [searchField, setSearchField] = useState('');
  const { userId } = useSelector((state) => state.auth);

  const { sendAction } = useApiAction(
    (newMemberId) => addUserToChannel(channelId, newMemberId),
    errorHandler,
  );

  const { loaded, result } = useFetchData(
    () => searchChatSpaceMembers(searchField),
    errorHandler,
    null,
    [searchField],
  );

  const { result: channelMembersResult } = useFetchData(
    () => getChannelMembers(channelId),
    errorHandler,
  );

  const filteredUsers = result?.data.filter((u) => u.id !== userId) || [];

  const handleUserAdd = async (id, toggle) => {
    const {status} = await sendAction(id)

    if(status === 204) {
      toggle();
    }
  }

  return (
    <div className="flex flex-col mt-[10px] w-[300px]">
      <input
        type="text"
        placeholder="Type to search for users"
        className="w-full border border-tuna rounded-[3px] p-[8px]"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      />
      <div className="flex flex-col max-h-[300px] overflow-y-auto">
        {filteredUsers?.map(({ userName, id }) => (
          <div key={id} className="flex justify-between items-center py-[10px]">
            <span>{userName}</span>
            <Button onClick={() => handleUserAdd(id, toggle)} className="px-[8px] py-[3px]">Add</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withErrorWrapper(AddUsersToChannel);
