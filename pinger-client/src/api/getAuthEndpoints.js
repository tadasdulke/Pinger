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
        const response = await instance.get(API_SERVICE_ENDPOINTS.REFRESH_TOKEN, {
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

    const appendClaims = async (chatspaceId) => {
        const response = await instance.put(API_SERVICE_ENDPOINTS.APPEND_CLAIMS, { chatspaceId }, {
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

        const {status, data} = response;

        return {
            status,
            data
        };
    };

    return {
        handleRegistration,
        getToken,
        refreshToken,
        appendClaims
    }
}

export default getAuthEndpoints;