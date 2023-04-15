import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getChannelReadTimesEndpoints from '../getChannelReadTimesEndpoints'

describe('getChannelReadTimesEndpoints', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const putMock = jest.fn().mockResolvedValue(response);

    const instance = {
        put: putMock,
    }
  
    test('should update channel readtime', async () => {
        const { updateChannelReadTime } = getChannelReadTimesEndpoints(instance)

        const channelId = "channelId"

        const result = await updateChannelReadTime(channelId);

        expect(putMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.CHANNEL_READ_TIMES}/${channelId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });

});
