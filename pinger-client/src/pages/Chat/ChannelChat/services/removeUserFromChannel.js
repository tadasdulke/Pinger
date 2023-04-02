import apiClient from '@Api';

const removeUserFromChannel = async (channelId, messageId) => await apiClient.removeUserFromChannel(channelId, messageId);

export default removeUserFromChannel;
