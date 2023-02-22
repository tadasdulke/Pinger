import apiClient from '@Api';

const handleRegistration = async (email, username, password) => {
  await apiClient.handleRegistration(email, username, password);
};

export default handleRegistration;