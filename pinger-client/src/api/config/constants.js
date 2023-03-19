export const API_SERVICE_BASE = 'http://localhost:5122'
export const API_SERVICE_ENDPOINTS = {
    LOGIN: '/api/authenticate/login',
    REFRESH_TOKEN: '/api/authenticate/refresh-token',
    APPEND_CLAIMS: '/api/authenticate/append-claims',
    REGISTER: '/api/authenticate/register',
    CHATSPACES: '/api/chatspaces',
    CHATSPACE_MEMBERS: '/api/chatspaces/members',
    JOINED_CHATSPACES: '/api/chatspaces/joined',
    USERS_CONTACTED_USERS: '/api/user/contacted-users',
    PRIVATE_MESSAGES: '/api/private-messages',
    CHANNEL_MESSAGES: '/api/channel-messages',
    CHANNELS: '/api/channel',
    CHANNEL_MESSAGE_READ_TIMES: '/api/channel-messages-read-times',
}