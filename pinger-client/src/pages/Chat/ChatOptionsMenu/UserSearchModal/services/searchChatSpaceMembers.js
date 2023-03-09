import apiClient from '@Api';

const searchChatSpaceMembers = async (chatspaceId, search) => {
    if(!search || !chatspaceId) {
        return null;
    }
    
    return await apiClient.searchChatSpaceMembers(chatspaceId, search);

}

export default searchChatSpaceMembers;

