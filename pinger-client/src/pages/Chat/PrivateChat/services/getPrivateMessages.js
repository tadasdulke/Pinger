import apiClient from '@Api';

const getPrivateMessages = async (receiverId) => {
    if(!receiverId) {
        return null;
    }

    return await apiClient.getPrivateMessages(receiverId);
}

export default getPrivateMessages;