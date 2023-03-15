import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChannelEndpoints = (instance) => {
    const createChannel = async (name) => {
        const response = await instance.post(API_SERVICE_ENDPOINTS.CHANNELS, { name }, {
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

    const getChannels = async () => {
        const response = await instance.get(API_SERVICE_ENDPOINTS.CHANNELS, {
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

    const getChannel = async (channelId) => {
        const response = await instance.get(`${API_SERVICE_ENDPOINTS.CHANNELS}/${channelId}`, {
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
        createChannel,
        getChannels,
        getChannel
    }
}

export default getChannelEndpoints;