import apiClient from '@Api';

const getChannelMessages = async (channelId, offset, step, skip) => await apiClient.getChannelMessages(channelId, offset, step, skip);

export default getChannelMessages;
