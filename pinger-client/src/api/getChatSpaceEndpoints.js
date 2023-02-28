import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChatSpaceEndpoints = (instance) => {
    const getUserChatSpaces = async () => {
        const response = await instance.get(API_SERVICE_ENDPOINTS.CHATSPACES, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }; 

    const createChatSpace = async (name) => {
        const response = await instance.post(API_SERVICE_ENDPOINTS.CHATSPACES, { name }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    };

    return {
        getUserChatSpaces,
        createChatSpace
    }
}

export default getChatSpaceEndpoints;