import apiClient from '@Api';

const searchChatSpaceMembers = async (search) => {
  return await apiClient.searchChatSpaceMembers(search);
};

export default searchChatSpaceMembers;
