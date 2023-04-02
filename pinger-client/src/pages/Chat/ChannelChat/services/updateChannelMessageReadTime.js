import apiClient from '@Api';

const updateChannelMessageReadTime = async (channelId) => await apiClient.updateChannelMessageReadTime(channelId);

export default updateChannelMessageReadTime;
