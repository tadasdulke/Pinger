import apiClient from '@Api';

const joinChatSpace = async (chatspaceId) => await apiClient.joinChatSpace(chatspaceId);

export default joinChatSpace;