import apiClient from '@Api';

const updateSelf = async (file, userName) => await apiClient.updateSelf(file, userName);

export default updateSelf;
