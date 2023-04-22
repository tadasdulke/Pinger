import apiClient from '@Api';

const getAvailableChannels = async () => await apiClient.getAvailableChannels();

export default getAvailableChannels;
