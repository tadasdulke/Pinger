import { API_SERVICE_ENDPOINTS } from './config/constants';

const getChatSpaceEndpoints = (instance) => {
  const getUserChatSpaces = async () => {
    const response = await instance.get(API_SERVICE_ENDPOINTS.JOINED_CHATSPACES, {
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
  
  const getInvitedChatSpaces = async () => {
    const response = await instance.get(API_SERVICE_ENDPOINTS.INVITED_CHATSPACES, {
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
  
  const getInvitedUsers = async () => {
    const response = await instance.get(`${API_SERVICE_ENDPOINTS.CHATSPACES}/invited-users`, {
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
  
  const acceptInvitation = async (chatspaceId) => {
    const response = await instance.post(`${API_SERVICE_ENDPOINTS.CHATSPACES}/accept-invite/${chatspaceId}`, {
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

  const inviteUserToChatSpace = async (userId) => {
    const response = await instance.post(`${API_SERVICE_ENDPOINTS.CHATSPACE_MEMBERS}/${userId}`, {
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

  const createChatSpace = async (name, isPrivate) => {
    const response = await instance.post(API_SERVICE_ENDPOINTS.CHATSPACES, { name, private: isPrivate }, {
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

  const searchChatSpaceMembers = async (search) => {
    const response = await instance.get(
      API_SERVICE_ENDPOINTS.CHATSPACE_MEMBERS,
      {
        params: {
          search,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const getChatSpaces = async () => {
    const response = await instance.get(
      API_SERVICE_ENDPOINTS.CHATSPACES,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const joinChatSpace = async (chatspaceId) => {
    const response = await instance.post(
      `${API_SERVICE_ENDPOINTS.CHATSPACES}/${chatspaceId}/join`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const getChatSpace = async (chatspaceId) => {
    const response = await instance.get(
      `${API_SERVICE_ENDPOINTS.CHATSPACES}/${chatspaceId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const getChatSpaceMember = async (memberId) => {
    const response = await instance.get(
      `${API_SERVICE_ENDPOINTS.CHATSPACES}/members/${memberId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const removeChatSpaceMember = async (memberId) => {
    const response = await instance.delete(
      `${API_SERVICE_ENDPOINTS.CHATSPACES}/members/${memberId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  const updateChatSpace = async (name) => {
    const response = await instance.put(
      `${API_SERVICE_ENDPOINTS.CHATSPACES}`,
      {
        name
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { status, data } = response;

    return {
      status,
      data,
    };
  };

  return {
    getUserChatSpaces,
    createChatSpace,
    searchChatSpaceMembers,
    getChatSpaces,
    joinChatSpace,
    getChatSpaceMember,
    getChatSpace,
    getInvitedChatSpaces,
    updateChatSpace,
    removeChatSpaceMember,
    inviteUserToChatSpace,
    acceptInvitation,
    getInvitedUsers
  };
};

export default getChatSpaceEndpoints;
