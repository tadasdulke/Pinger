import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getChannelMessageEndpoints from '../getChannelMessageEndpoints'

describe('getChannelMessageEndpoints', () => {
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
  
    test('should return channel messages', async () => {
        const { getChannelMessages } = getChannelMessageEndpoints(instance)

        const channelId = "channelId"
        const offset = 4;
        const step = 5;
        const skip = 1;

        const result = await getChannelMessages(channelId, offset, step, skip);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/${channelId}?offset=${offset}&step=${step}&skip=${skip}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual(response)
    });
  
    test('should return unread channel messages', async () => {
        const { getUnreadChannelMessages } = getChannelMessageEndpoints(instance)

        const channelId = "channelId"

        const result = await getUnreadChannelMessages(channelId);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/unread/${channelId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual(response)
    });
  
    test('should remove private message', async () => {
        const { removeChannelMessage } = getChannelMessageEndpoints(instance)

        const messageId = 4

        const result = await removeChannelMessage(messageId);

        expect(deleteMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/${messageId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(result).toEqual(response)
    });
  
    test('should update private message', async () => {
        const { updateChannelMessage } = getChannelMessageEndpoints(instance)

        const messageId = 4
        const body = "heyo"

        const result = await updateChannelMessage(messageId, body);

        expect(putMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNEL_MESSAGES}/${messageId}`,
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
