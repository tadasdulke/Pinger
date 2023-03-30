import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, useFetchData, useApiAction, withErrorWrapper } from '@Common'
import { searchChatSpaceMembers } from '@Services'
import removeUserFromChannel from '../services/removeUserFromChannel'

const AddUsersToChannel =  ({errorHandler}) => {
    const { channelId } = useParams();
    const [searchField, setSearchField] = useState('');
    const { userId } = useSelector(state => state.auth);

    const { sendAction: removeUserFromChannelAction } = useApiAction(
        (messageId) => removeUserFromChannel(channelId, messageId),
    )

    const {loaded, result} = useFetchData(
        () => searchChatSpaceMembers(searchField),
        errorHandler,
        null,
        [searchField]
    )

    const filteredUsers = result?.data.filter(u => u.id !== userId) || [];

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
                {filteredUsers.map(({userName, id}) => (
                    <div key={id} className="flex justify-between items-center py-[10px]">
                        <span>{userName}</span>
                        <Button onClick={async () => await removeUserFromChannelAction(id)} className="px-[8px] py-[3px] bg-red-600">Remove</Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default withErrorWrapper(AddUsersToChannel);