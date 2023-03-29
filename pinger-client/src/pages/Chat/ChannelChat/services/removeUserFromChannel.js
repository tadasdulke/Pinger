import apiClient from '@Api';

const removeUserFromChannel = async (channelId, messageId) => {
    return await apiClient.removeUserFromChannel(channelId, messageId);
}

export default removeUserFromChannel;