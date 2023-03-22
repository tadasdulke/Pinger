import apiClient from '@Api';

const updatePrivateMessage = async (messageId, body) => {
    return await apiClient.updatePrivateMessage(messageId, body);
}

export default updatePrivateMessage;