import apiClient from '@Api';

const createChatSpace = async (name) => {
  return apiClient.createChatSpace(name);
};

export default createChatSpace;
