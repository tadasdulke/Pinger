import { useApiAction } from '@Common'

import removeChannel from '../services/removeChannel';

const useDeleteChannel = () => {
    const { loaded: channelRemoved, sendAction: removeChannelAction } = useApiAction(
        (channelId) => removeChannel(channelId),
    );

    return {
        channelRemoved,
        removeChannelAction
    }
}

export default useDeleteChannel;