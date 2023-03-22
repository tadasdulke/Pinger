import apiClient from '@Api';

const removePrivateMessage = async (messageId) => {
    return await apiClient.removePrivateMessage(messageId);
}

export default removePrivateMessage;