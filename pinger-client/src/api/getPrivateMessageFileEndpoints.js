import { API_SERVICE_ENDPOINTS } from './config/constants';

const getFileEndpoints = (instance) => {
  const addPrivateMessageFile = async (file, receiverId) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('receiverId', receiverId);

    const response = await instance.post(API_SERVICE_ENDPOINTS.PRIVATE_MESSAGE_FILES, bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  return {
    addPrivateMessageFile,
  };
};

export default getFileEndpoints;
