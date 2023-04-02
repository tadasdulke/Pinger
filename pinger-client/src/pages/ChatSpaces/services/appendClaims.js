import apiClient from '@Api';

const appendClaims = async (chatspaceId) => await apiClient.appendClaims(chatspaceId);

export default appendClaims;
