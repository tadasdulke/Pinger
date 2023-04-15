import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getChatSpaceEndpoints from '../getChatSpaceEndpoints'

describe('getChatSpaceEndpoints', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const postMock = jest.fn().mockResolvedValue(response);
    const getMock = jest.fn().mockResolvedValue(response);
    const putMock = jest.fn().mockResolvedValue(response);

    const instance = {
        post: postMock,
        get: getMock,
        put: putMock,
    }
  
    test('should return user chatspaces', async () => {
        const { getUserChatSpaces } = getChatSpaceEndpoints(instance)

        const result = await getUserChatSpaces();

        expect(getMock).toBeCalledWith(API_SERVICE_ENDPOINTS.JOINED_CHATSPACES, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should create chatspace', async () => {
        const { createChatSpace } = getChatSpaceEndpoints(instance)

        const name = "chatspacename"

        const result = await createChatSpace(name);

        expect(postMock).toBeCalledWith(API_SERVICE_ENDPOINTS.CHATSPACES, { name }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });

    test('should return searched chatspaces', async () => {
        const { searchChatSpaceMembers } = getChatSpaceEndpoints(instance)

        const search = "search"

        const result = await searchChatSpaceMembers(search);

        expect(getMock).toBeCalledWith(API_SERVICE_ENDPOINTS.CHATSPACE_MEMBERS,
            {
              params: {
                search,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            },)
        expect(result).toEqual(response)
    });

    test('should get all chatspaces', async () => {
        const { getChatSpaces } = getChatSpaceEndpoints(instance)

        const result = await getChatSpaces();

        expect(getMock).toBeCalledWith(API_SERVICE_ENDPOINTS.CHATSPACES,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            })
        expect(result).toEqual(response)
    });

    test('should join chatspace', async () => {
        const { joinChatSpace } = getChatSpaceEndpoints(instance)

        const chatspaceId = 4;
        const result = await joinChatSpace(chatspaceId);

        expect(postMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHATSPACES}/${chatspaceId}/join`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual(response)
    });

    test('should get particular chatspace', async () => {
        const { getChatSpace } = getChatSpaceEndpoints(instance)

        const chatspaceId = 4;
        const result = await getChatSpace(chatspaceId);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHATSPACES}/${chatspaceId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual(response)
    });

    test('should get chatspace member', async () => {
        const { getChatSpaceMember } = getChatSpaceEndpoints(instance)

        const memberId = "memberId";
        const result = await getChatSpaceMember(memberId);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHATSPACES}/members/${memberId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual(response)
    });
});
