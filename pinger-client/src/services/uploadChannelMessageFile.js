import apiClient from '@Api';

const uploadChannelMessageFile = async (file, channelId) => await apiClient.addChannelMessageFile(file, channelId);

export default uploadChannelMessageFile;
