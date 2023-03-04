import apiClient from '../../../api';

const getToken = async (username, password) => {
  const response = await apiClient.getToken(username, password);

  return response;
};

export default getToken;