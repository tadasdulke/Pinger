import apiClient from '../../../api';

const getToken = async (username, password) => {
  const token = await apiClient.getToken(username, password);

  return token;
};

export default getToken;