import apiClient from '@Api';

const updateChannelReadTime = async (channelId) => await apiClient.updateChannelReadTime(channelId);

export default updateChannelReadTime;
