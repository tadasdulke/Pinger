import apiClient from '@Api';

const editChannel = (channelId, name) => apiClient.editChannel(channelId, name);

export default editChannel;
