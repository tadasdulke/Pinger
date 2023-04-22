import apiClient from '@Api';

const acceptInvitation = async (chatSpaceId) => await apiClient.acceptInvitation(chatSpaceId);

export default acceptInvitation;
