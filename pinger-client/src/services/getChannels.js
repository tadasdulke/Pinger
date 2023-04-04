import apiClient from '@Api';

const getChannels = async (search) => await apiClient.getChannels(search);

export default getChannels;
