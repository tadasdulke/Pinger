import axios from 'axios';
import { API_SERVICE_BASE } from './config/constants';
import getAuthEndpoints from './getAuthEndpoints';
import getChatSpaceEndpoints from './getChatSpaceEndpoints';

export const createPingerClient = () => {
  const instance = axios.create({
    baseURL: API_SERVICE_BASE,
  });

  const {getToken, handleRegistration} = getAuthEndpoints(instance);
  const {getUserChatSpaces, createChatSpace} = getChatSpaceEndpoints(instance);

  return {
    getToken,
    handleRegistration,
    getUserChatSpaces,
    createChatSpace
  };
};

const pingerClient = createPingerClient();

export default pingerClient;