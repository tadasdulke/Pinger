import apiClient from '@Api';

const updateChannelMessage = async (messageId, body) => await apiClient.updateChannelMessage(messageId, body);

export default updateChannelMessage;
