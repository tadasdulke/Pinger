import apiClient from '@Api';

const updateChannelMessage = async (messageId, body) => {
    return await apiClient.updateChannelMessage(messageId, body);
}

export default updateChannelMessage;