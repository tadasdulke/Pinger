import apiClient from '@Api';

const inviteUserToChatSpace = async (userId) => await apiClient.inviteUserToChatSpace(userId);

export default inviteUserToChatSpace;
