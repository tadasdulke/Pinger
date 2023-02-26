import apiClient from '@Api';

const getUserChatSpaces = async () => {
  const userChatSpaces = await apiClient.getUserChatSpaces();

  return userChatSpaces;
};

export default getUserChatSpaces;