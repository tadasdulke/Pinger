import apiClient from '@Api';

const uploadPrivateFile = async (file, receiverId) => {
    return await apiClient.addPrivateMessageFile(file, receiverId)
}

export default uploadPrivateFile;