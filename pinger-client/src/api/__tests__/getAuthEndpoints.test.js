import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getAuthEndpoints from '../getAuthEndpoints'

describe('getAuthEndpoints', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const getMock = jest.fn().mockResolvedValue(response);
    const putMock = jest.fn().mockResolvedValue(response);
    const deleteMock = jest.fn().mockResolvedValue(response);
    const postMock = jest.fn().mockResolvedValue(response);

    const instance = {
        get: getMock,
        put: putMock,
        post: postMock,
        delete: deleteMock
    }
  
    test('should get token', async () => {
        const { getToken } = getAuthEndpoints(instance)

        const username = "name"
        const password = "password"

        const result = await getToken(username, password);

        expect(postMock).toBeCalledWith(API_SERVICE_ENDPOINTS.LOGIN, {
            username,
            password,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });

    test('should refresh token', async () => {
        const { refreshToken } = getAuthEndpoints(instance)

        const result = await refreshToken();

        expect(getMock).toBeCalledWith(API_SERVICE_ENDPOINTS.REFRESH_TOKEN, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });

    test('should append chatspaceId to jwt claims', async () => {
        const { appendClaims } = getAuthEndpoints(instance)

        const chatspaceId = 4;
        const result = await appendClaims(chatspaceId);

        expect(putMock).toBeCalledWith(API_SERVICE_ENDPOINTS.APPEND_CLAIMS, { chatspaceId }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });

    test('should register user', async () => {
        const { handleRegistration } = getAuthEndpoints(instance)

        const email = "test@test.com";
        const username = "username";
        const password = "password";
        const result = await handleRegistration(email, username, password);

        expect(postMock).toBeCalledWith(API_SERVICE_ENDPOINTS.REGISTER, {
            email,
            username,
            password,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });

    test('should revoke token', async () => {
        const { revokeToken } = getAuthEndpoints(instance)

        const result = await revokeToken();

        expect(deleteMock).toBeCalledWith(API_SERVICE_ENDPOINTS.REVOKE_TOKEN, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
}); 
