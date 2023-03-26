import apiClient from '@Api';

const uploadChannelMessageFile = async (file, channelId) => {
    return await apiClient.addChannelMessageFile(file, channelId)
}

export default uploadChannelMessageFile;