import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChannelMessageFileEndpoints = (instance) => {
    const addChannelMessageFile = async (file, channelId) => {
        const bodyFormData = new FormData();
        bodyFormData.append('file', file); 
        bodyFormData.append('channelId', channelId); 

        const response = await instance.post(API_SERVICE_ENDPOINTS.CHANNEL_MESSAGE_FILES, bodyFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const {status, data} = response;

        return {
            status,
            data
        };
    };
    
    return {
        addChannelMessageFile
    }
}

export default getChannelMessageFileEndpoints;