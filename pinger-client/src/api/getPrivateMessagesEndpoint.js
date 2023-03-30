import { API_SERVICE_ENDPOINTS } from './config/constants';

const getPrivateMessagesEndpoint = (instance) => {
    const getPrivateMessages = async (receiverId, offset, step) => {
        const response = await instance.get(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/${receiverId}?offset=${offset}&&step=${step}`, {
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

    const removePrivateMessage = async (messageId) => {
        const response = await instance.delete(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/${messageId}`, {
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

    const updatePrivateMessage = async (messageId, body) => {
        const response = await instance.put(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/${messageId}`, 
        {
            body
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
        getPrivateMessages,
        removePrivateMessage,
        updatePrivateMessage
    }
}

export default getPrivateMessagesEndpoint;