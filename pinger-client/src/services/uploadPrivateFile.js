import apiClient from '@Api';

const uploadPrivateFile = async (file, receiverId) => await apiClient.addPrivateMessageFile(file, receiverId);

export default uploadPrivateFile;
