import apiClient from '@Api';

const createChannel = (name) => apiClient.createChannel(name)

export default createChannel;