import apiClient from '@Api';

const getUnreadPrivateMessages = async (receiverId) => {
  if (!receiverId) {
    return null;
  }

  return await apiClient.getUnreadPrivateMessages(receiverId);
};

export default getUnreadPrivateMessages;
