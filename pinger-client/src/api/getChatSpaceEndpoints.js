import store from '@Store';
import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChatSpaceEndpoints = (instance) => {
    const getUserChatSpaces = async () => {
        const token = store.getState().auth.token;
        const response = await instance.get(API_SERVICE_ENDPOINTS.CHATSPACES, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        return response.data;
    };

    const createChatSpace = async (name) => {
        const token = store.getState().auth.token;
        const response = await instance.post(API_SERVICE_ENDPOINTS.CHATSPACES, { name }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
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