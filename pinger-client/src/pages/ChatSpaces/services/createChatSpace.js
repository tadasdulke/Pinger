import apiClient from '@Api';

const createChatSpace = async (name) => {
  await apiClient.createChatSpace(name);
};

export default createChatSpace;