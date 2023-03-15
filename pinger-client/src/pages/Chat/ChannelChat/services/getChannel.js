import apiClient from '@Api';

const getChannel = async (channelId) => {
    return await apiClient.getChannel(channelId);
}

export default getChannel;