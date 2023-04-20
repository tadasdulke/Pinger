import apiClient from '@Api';

const updateChatSpace = async (name) => await apiClient.updateChatSpace(name);

export default updateChatSpace;
