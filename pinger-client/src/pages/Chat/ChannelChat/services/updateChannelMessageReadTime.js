import apiClient from '@Api';

const updateChannelMessageReadTime = async (channelId) => {
    return await apiClient.updateChannelMessageReadTime(channelId);
}

export default updateChannelMessageReadTime;