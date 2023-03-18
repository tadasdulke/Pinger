import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChannelMessageEndpoints = (instance) => {
    const getChannelMessages = async (channelId, offset, step) => {
        const response = await instance.get(
            `${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/${channelId}?offset=${offset}&&step=${step}`,
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
        getChannelMessages,
    }
}

export default getChannelMessageEndpoints;