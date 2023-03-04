import { API_SERVICE_ENDPOINTS } from './config/constants';

const getAuthEndpoints = (instance) => {
    const getToken = async (username, password) => {
        const response = await instance.post(API_SERVICE_ENDPOINTS.LOGIN, {
            username,
            password,
        }, {
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

    const refreshToken = async () => {
        const response = await instance.get(API_SERVICE_ENDPOINTS['REFRESH-TOKEN'], {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data.token;
    };

    const handleRegistration = async (email, username, password) => {
        const response = await instance.post(API_SERVICE_ENDPOINTS.REGISTER, {
            email,
            username,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    };

    return {
        handleRegistration,
        getToken,
        refreshToken
    }
}

export default getAuthEndpoints;