import apiClient from '@Api';

const revokeToken = async () => await apiClient.revokeToken();

export default revokeToken;
