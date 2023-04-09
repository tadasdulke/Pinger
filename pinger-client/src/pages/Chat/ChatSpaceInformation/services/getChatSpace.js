import apiClient from '@Api';

const getChatSpace = async (chatSpaceId) => await apiClient.getChatSpace(chatSpaceId);

export default getChatSpace;
