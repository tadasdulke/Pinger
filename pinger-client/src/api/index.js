import axios from 'axios';

import { API_SERVICE_BASE, API_SERVICE_ENDPOINTS } from './config/constants';

export const createTesonetClient = () => {
  const instance = axios.create({
    baseURL: API_SERVICE_BASE,
  });

  const getToken = async (username, password) => {
    const response = await instance.post(API_SERVICE_ENDPOINTS.LOGIN, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.token;
  };

  const handleRegistration = async (email, username, password) => {
    const response = await instance.post(API_SERVICE_ENDPOINTS.REGISTER, {
      email,
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  };

  return {
    getToken,
    handleRegistration
  };
};

const tesonetClient = createTesonetClient();

export default tesonetClient;