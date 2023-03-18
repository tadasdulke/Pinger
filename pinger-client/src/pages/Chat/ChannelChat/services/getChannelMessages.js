import apiClient from '@Api';

const getChannelMessages = async (channelId, offset, step) => {
    return await apiClient.getChannelMessages(channelId, offset, step);
}

export default getChannelMessages;