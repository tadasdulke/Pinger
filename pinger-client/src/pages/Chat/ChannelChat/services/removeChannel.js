import apiClient from '@Api';

const removeChannel = async (channelId) => await apiClient.removeChannel(channelId);

export default removeChannel;
