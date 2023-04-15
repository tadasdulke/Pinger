import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getPrivateMessagesEndpoint from '../getPrivateMessagesEndpoint'

describe('getPrivateMessagesEndpoint', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const getMock = jest.fn().mockResolvedValue(response);
    const putMock = jest.fn().mockResolvedValue(response);
    const deleteMock = jest.fn().mockResolvedValue(response);

    const instance = {
        get: getMock,
        put: putMock,
        delete: deleteMock
    }
  
    test('should return private messages', async () => {
        const { getPrivateMessages } = getPrivateMessagesEndpoint(instance)

        const receiverId = "receiverId"
        const offset = 4;
        const step = 5;
        const skip = 1;

        const result = await getPrivateMessages(receiverId, offset, step, skip);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/${receiverId}?offset=${offset}&step=${step}&skip=${skip}`, {
            headers: {
              'Content-Type': 'application/json',
            },
        })
        expect(result).toEqual(response)
    });
  
    test('should return unread pirvate messages', async () => {
        const { getUnreadPrivateMessages } = getPrivateMessagesEndpoint(instance)

        const receiverId = "receiverId"

        const result = await getUnreadPrivateMessages(receiverId);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/unread/${receiverId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should remove private message', async () => {
        const { removePrivateMessage } = getPrivateMessagesEndpoint(instance)

        const messageId = 4

        const result = await removePrivateMessage(messageId);

        expect(deleteMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/${messageId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should update private message', async () => {
        const { updatePrivateMessage } = getPrivateMessagesEndpoint(instance)

        const messageId = 4
        const body = "heyo"

        const result = await updatePrivateMessage(messageId, body);

        expect(putMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.PRIVATE_MESSAGES}/${messageId}`,
        {
          body,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual(response)
    });
});
