import apiClient from '@Api';

const getChannel = async (channelId) => await apiClient.getChannel(channelId);

export default getChannel;
