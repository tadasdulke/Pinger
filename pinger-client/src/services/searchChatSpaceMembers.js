import apiClient from '@Api';

const searchChatSpaceMembers = async (search) => {
  if (!search) {
    return null;
  }

  return await apiClient.searchChatSpaceMembers(search);
};

export default searchChatSpaceMembers;
