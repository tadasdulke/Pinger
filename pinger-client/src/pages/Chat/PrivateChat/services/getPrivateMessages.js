import apiClient from '@Api';

const getPrivateMessages = async (receiverId, offset, step) => {
    if(!receiverId) {
        return null;
    }

    return await apiClient.getPrivateMessages(receiverId, offset, step);
}

export default getPrivateMessages;