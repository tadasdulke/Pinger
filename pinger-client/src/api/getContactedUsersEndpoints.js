import { API_SERVICE_ENDPOINTS } from './config/constants';

const getContactedUsersEndpoints = (instance) => {
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

  const updateContactedUserReadTime = async (contactedUserId) => {
    const response = await instance.put(`${API_SERVICE_ENDPOINTS.USERS_CONTACTED_USERS}/${contactedUserId}/readtime`, {
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

  return {
    addContactedUser,
    getContactedUsers,
    updateContactedUserReadTime
  };
};

export default getContactedUsersEndpoints;
