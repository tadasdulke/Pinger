import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChannelMessageEndpoints = (instance) => {
  const getChannelMessages = async (channelId, offset, step, skip) => {
    const response = await instance.get(
      `${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/${channelId}?offset=${offset}&step=${step}&skip=${skip}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const getUnreadChannelMessages = async (channelId) => {
    const response = await instance.get(
      `${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/unread/${channelId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const removeChannelMessage = async (messageId) => {
    const response = await instance.delete(
      `${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/${messageId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const updateChannelMessage = async (messageId, body) => {
    const response = await instance.put(
      `${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/${messageId}`,
      {
        body,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  return {
    getChannelMessages,
    removeChannelMessage,
    updateChannelMessage,
    getUnreadChannelMessages
  };
};

export default getChannelMessageEndpoints;
