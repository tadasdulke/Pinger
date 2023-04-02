import { API_SERVICE_ENDPOINTS } from './config/constants';

const getUserEndpoints = (instance) => {
  const addContactedUser = async (contactedUserId) => {
    const response = await instance.post(API_SERVICE_ENDPOINTS.USERS_CONTACTED_USERS, { contactedUserId }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const getContactedUsers = async () => {
    const response = await instance.get(API_SERVICE_ENDPOINTS.USERS_CONTACTED_USERS, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const getSelf = async () => {
    const response = await instance.get(API_SERVICE_ENDPOINTS.USERS, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const updateSelf = async (file, username) => {
    const bodyFormData = new FormData();
    if (file) {
      bodyFormData.append('profileImage', file);
    }
    bodyFormData.append('username', username);

    const response = await instance.put(API_SERVICE_ENDPOINTS.USERS, bodyFormData, {
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
    addContactedUser,
    getContactedUsers,
    getSelf,
    updateSelf,
  };
};

export default getUserEndpoints;
