import apiClient from '@Api';

const updateContactedUserReadTime = async (contactedUserId) => await apiClient.updateContactedUserReadTime(contactedUserId);

export default updateContactedUserReadTime;
