import apiClient from '@Api';

const addUserToChannel = async (channelId, newMemberId) => await apiClient.addUserToChannel(channelId, newMemberId);

export default addUserToChannel;
