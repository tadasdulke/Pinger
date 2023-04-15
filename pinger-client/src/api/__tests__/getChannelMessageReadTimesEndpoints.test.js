import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getChannelMessageReadTimesEndpoints from '../getChannelMessageReadTimesEndpoints'

describe('getChannelMessageReadTimesEndpoints', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const putMock = jest.fn().mockResolvedValue(response);

    const instance = {
        put: putMock,
    }
  
    test('should update channel readtime', async () => {
        const { updateChannelMessageReadTime } = getChannelMessageReadTimesEndpoints(instance)

        const channelId = "channelId"

        const result = await updateChannelMessageReadTime({channelId});

        expect(putMock).toBeCalledWith(API_SERVICE_ENDPOINTS.CHANNEL_MESSAGE_READ_TIMES,
            {
              channelId,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            })
        expect(result).toEqual(response)
    });

});
