import { API_SERVICE_ENDPOINTS } from './config/constants';

const getPrivateMessagesEndpoint = (instance) => {
    const getPrivateMessages = async (receiverId) => {
        const response = await instance.get(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/${receiverId}`, {
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
        getPrivateMessages,
    }
}

export default getPrivateMessagesEndpoint;