import apiClient from '@Api';

const removeChannelMessage = async (messageId) => {
    return await apiClient.removeChannelMessage(messageId);
}

export default removeChannelMessage;