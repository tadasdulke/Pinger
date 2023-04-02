import apiClient from '@Api';

const getPrivateMessages = async (receiverId, offset, step, skip) => {
  if (!receiverId) {
    return null;
  }

  return await apiClient.getPrivateMessages(receiverId, offset, step, skip);
};

export default getPrivateMessages;
