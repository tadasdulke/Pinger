import apiClient from '@Api';

const getContactedUser = async (contactedUserId) => await apiClient.getContactedUser(contactedUserId);

export default getContactedUser;
