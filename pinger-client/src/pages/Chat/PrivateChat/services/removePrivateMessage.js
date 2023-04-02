import apiClient from '@Api';

const removePrivateMessage = async (messageId) => await apiClient.removePrivateMessage(messageId);

export default removePrivateMessage;
