import apiClient from '@Api';

const createChannel = (name, isPrivate) => apiClient.createChannel(name, isPrivate);

export default createChannel;
