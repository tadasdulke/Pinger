import apiClient from '@Api';

const updatePrivateMessage = async (messageId, body) => await apiClient.updatePrivateMessage(messageId, body);

export default updatePrivateMessage;
