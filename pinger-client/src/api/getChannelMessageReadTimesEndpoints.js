import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChannelMessageReadTimesEndpoints = (instance) => {
    const updateChannelMessageReadTime = async ({channelId}) => {
        const response = await instance.put(API_SERVICE_ENDPOINTS.CHANNEL_MESSAGE_READ_TIMES, 
        {
            channelId
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const {status, data} = response;

        return {
            status,
            data
        };
    }; 

    return {
        updateChannelMessageReadTime,
    }
}

export default getChannelMessageReadTimesEndpoints;