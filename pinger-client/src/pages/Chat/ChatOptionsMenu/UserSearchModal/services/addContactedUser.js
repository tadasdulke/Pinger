import apiClient from '@Api';

const addContactedUser = async (contactedUserId) => await apiClient.addContactedUser(contactedUserId);

export default addContactedUser;
