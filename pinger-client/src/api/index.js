import axios from 'axios';
import { API_SERVICE_BASE } from './config/constants';
import getAuthEndpoints from './getAuthEndpoints';
import getChatSpaceEndpoints from './getChatSpaceEndpoints';
import jwtInterceptor from './interceptors/jwtInterceptor';

export const createPingerClient = () => {
  const instance = axios.create({
    baseURL: API_SERVICE_BASE,
    withCredentials: true
  });

  const {getToken, handleRegistration, refreshToken} = getAuthEndpoints(instance);
  const {getUserChatSpaces, createChatSpace} = getChatSpaceEndpoints(instance);
  jwtInterceptor(instance, refreshToken);

  return {
    getToken,
    handleRegistration,
    getUserChatSpaces,
    createChatSpace,
    refreshToken
  };
};

const pingerClient = createPingerClient();

export default pingerClient;