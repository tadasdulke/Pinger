import apiClient from '@Api';

const addUserToChannel = async (channelId, newMemberId) => {
    return await apiClient.addUserToChannel(channelId, newMemberId);
}

export default addUserToChannel;