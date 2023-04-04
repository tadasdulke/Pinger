import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChannelReadTimes = (instance) => {
  const updateChannelReadTime = async (channelId) => {
    const response = await instance.put(`${API_SERVICE_ENDPOINTS.CHANNEL_READ_TIMES}/${channelId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  return {
    updateChannelReadTime
  };
};

export default getChannelReadTimes;
