import axios from 'axios';
import { API_SERVICE_BASE } from './config/constants';
import getAuthEndpoints from './getAuthEndpoints';
import getChatSpaceEndpoints from './getChatSpaceEndpoints';
import getUserEndpoints from './getUserEndpoints';
import getPrivateMessagesEndpoint from './getPrivateMessagesEndpoint';
import getChannelEndpoints from './getChannelEndpoints';
import jwtInterceptor from './interceptors/jwtInterceptor';
import getChannelMessageEndpoints from './getChannelMessageEndpoints';
import getChannelMessageReadTimesEndpoints from './getChannelMessageReadTimesEndpoints';
import getPrivateMessageFileEndpoints from './getPrivateMessageFileEndpoints';
import getChannelMessageFileEndpoints from './getChannelMessageFileEndpoints';
import getContactedUsersEndpoints from './ getContactedUsersEndpoints';

export const createPingerClient = () => {
  const instance = axios.create({
    baseURL: API_SERVICE_BASE,
    withCredentials: true,
  });

  const {
    getToken, handleRegistration, refreshToken, appendClaims, revokeToken,
  } = getAuthEndpoints(instance);
  const {
    getUserChatSpaces,
    createChatSpace,
    searchChatSpaceMembers,
    getChatSpaces,
    joinChatSpace,
    getChatSpaceMember,
  } = getChatSpaceEndpoints(instance);
  const { getSelf, updateSelf } = getUserEndpoints(instance);
  const { addContactedUser, getContactedUsers, updateContactedUserReadTime } = getContactedUsersEndpoints(instance);
  const { getPrivateMessages, removePrivateMessage, updatePrivateMessage, getUnreadPrivateMessages } = getPrivateMessagesEndpoint(instance);
  const { getChannelMessages, removeChannelMessage, updateChannelMessage } = getChannelMessageEndpoints(instance);
  const {
    createChannel, 
    getChannels, 
    getChannel, 
    addUserToChannel, 
    removeUserFromChannel, 
    editChannel, 
    removeChannel, 
    getChannelMembers
  } = getChannelEndpoints(instance);
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
    addChannelMessageFile,
    removeChannelMessage,
    updateChannelMessage,
    getSelf,
    updateSelf,
    removeUserFromChannel,
    revokeToken,
    editChannel,
    removeChannel,
    getChannelMembers,
    updateContactedUserReadTime,
    getUnreadPrivateMessages
  };
};

const pingerClient = createPingerClient();

export default pingerClient;
