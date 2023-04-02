import apiClient from '@Api';

const removeChannelMessage = async (messageId) => await apiClient.removeChannelMessage(messageId);

export default removeChannelMessage;
