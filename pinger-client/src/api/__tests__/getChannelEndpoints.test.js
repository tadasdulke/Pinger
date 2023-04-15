import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getChannelEndpoints from '../getChannelEndpoints'

describe('getChannelEndpoints', () => {
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
  
    test('should create channel', async () => {
        const { createChannel } = getChannelEndpoints(instance)

        const name = "channelname"

        const result = await createChannel(name);

        expect(postMock).toBeCalledWith(API_SERVICE_ENDPOINTS.CHANNELS, { name }, {
            headers: {
              'Content-Type': 'application/json',
            },
        })
        expect(result).toEqual(response)
    });
  
    test('should get channels', async () => {
        const { getChannels } = getChannelEndpoints(instance)

        const search = "channelname"

        const result = await getChannels(search);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNELS}${search ? `?search=${search}` : ''}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should get channel', async () => {
        const { getChannel } = getChannelEndpoints(instance)

        const channelId = 4

        const result = await getChannel(channelId);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNELS}/${channelId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should add user to channel', async () => {
        const { addUserToChannel } = getChannelEndpoints(instance)

        const channelId = 4
        const newMemberId = "memberId"

        const result = await addUserToChannel(channelId, newMemberId);

        expect(postMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNELS}/${channelId}/members`, { newMemberId }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should remove user from channel', async () => {
        const { removeUserFromChannel } = getChannelEndpoints(instance)

        const channelId = 4
        const memberId = "memberId"

        const result = await removeUserFromChannel(channelId, memberId);

        expect(deleteMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNELS}/${channelId}/members/${memberId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should edit channel', async () => {
        const { editChannel } = getChannelEndpoints(instance)

        const channelId = 4
        const name = "newChannelName"

        const result = await editChannel(channelId, name);

        expect(putMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNELS}/${channelId}`, {name}, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should remove channel', async () => {
        const { removeChannel } = getChannelEndpoints(instance)

        const channelId = 4

        const result = await removeChannel(channelId);

        expect(deleteMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNELS}/${channelId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should get channel members', async () => {
        const { getChannelMembers } = getChannelEndpoints(instance)

        const channelId = 4
        const search = "user name"

        const result = await getChannelMembers(channelId, search);

        expect(getMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNELS}/${channelId}/members${search ? `?search=${search}` : ""}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
}); 
