import { useApiAction } from '@Common'

import addUserToChannel from '../services/addUserToChannel';

const useAddUserToChannel = (channelId) => {
    const { sendAction } = useApiAction(
        (newMemberId) => addUserToChannel(channelId, newMemberId),
    );

    return {
        sendAction
    }
}

export default useAddUserToChannel;