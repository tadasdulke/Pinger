import { useApiAction } from '@Common'
import editChannel from '../services/editChannel'

const useEditChannel = (channelId) => {
    const { loaded: channelEdited, sendAction: editChannelAction } = useApiAction(
        (name) => editChannel(parseInt(channelId), name),
    );

    return {
        channelEdited,
        editChannelAction
    }
}

export default useEditChannel;