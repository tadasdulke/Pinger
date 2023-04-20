import apiClient from '@Api';

const createChatSpace = async (name, isPrivate) => {
  return apiClient.createChatSpace(name, isPrivate);
};

export default createChatSpace;
