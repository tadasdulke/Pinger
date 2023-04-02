import apiClient from '@Api';

const getChannelMembers = async (channelId, search = null) => {
  return await apiClient.getChannelMembers(channelId, search);
};

export default getChannelMembers;
