import axios from 'axios';
import { API_SERVICE_BASE } from './config/constants';
import getAuthEndpoints from './getAuthEndpoints';
import getChatSpaceEndpoints from './getChatSpaceEndpoints';
import getUserEndpoints from './getUserEndpoints'
import getPrivateMessagesEndpoint from './getPrivateMessagesEndpoint';
import getChannelEndpoints from './getChannelEndpoints';
import jwtInterceptor from './interceptors/jwtInterceptor';
import getChannelMessageEndpoints from './getChannelMessageEndpoints';
import getChannelMessageReadTimesEndpoints from './getChannelMessageReadTimesEndpoints';
import getPrivateMessageFileEndpoints from './getPrivateMessageFileEndpoints'
import getChannelMessageFileEndpoints from './getChannelMessageFileEndpoints'

export const createPingerClient = () => {
  const instance = axios.create({
    baseURL: API_SERVICE_BASE,
    withCredentials: true
  });

  const {getToken, handleRegistration, refreshToken, appendClaims} = getAuthEndpoints(instance);
  const {
    getUserChatSpaces, 
    createChatSpace, 
    searchChatSpaceMembers, 
    getChatSpaces, 
    joinChatSpace,
    getChatSpaceMember
  } = getChatSpaceEndpoints(instance);
  const { addContactedUser, getContactedUsers } = getUserEndpoints(instance);
  const { getPrivateMessages, removePrivateMessage, updatePrivateMessage } = getPrivateMessagesEndpoint(instance);
  const { getChannelMessages } = getChannelMessageEndpoints(instance);
  const { createChannel, getChannels, getChannel, addUserToChannel } = getChannelEndpoints(instance);
  const { updateChannelMessageReadTime } = getChannelMessageReadTimesEndpoints(instance);
  const { addPrivateMessageFile } = getPrivateMessageFileEndpoints(instance);
  const { addChannelMessageFile } = getChannelMessageFileEndpoints(instance);
  jwtInterceptor(instance, refreshToken);
  
  return {
    getToken,
    handleRegistration,
    getUserChatSpaces,
    createChatSpace,
    refreshToken,
    searchChatSpaceMembers,
    addContactedUser,
    getChatSpaces,
    joinChatSpace,
    getContactedUsers,
    appendClaims,
    getPrivateMessages,
    getChatSpaceMember,
    createChannel,
    getChannels,
    getChannel,
    getChannelMessages,
    addUserToChannel,
    updateChannelMessageReadTime,
    removePrivateMessage,
    updatePrivateMessage,
    addPrivateMessageFile,
    addChannelMessageFile
  };
};

const pingerClient = createPingerClient();

export default pingerClient;