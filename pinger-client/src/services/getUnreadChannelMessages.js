import apiClient from '@Api';

const getUnreadChannelMessages = async (receiverId) => {
  if (!receiverId) {
    return null;
  }

  return await apiClient.getUnreadChannelMessages(receiverId);
};

export default getUnreadChannelMessages;
