import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getChannelMessageFileEndpoints from '../getChannelMessageFileEndpoints'

describe('getChannelMessageFileEndpoints', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const postMock = jest.fn().mockResolvedValue(response);

    const instance = {
        post: postMock,
    }
  
    test('should update channel readtime', async () => {
        const { addChannelMessageFile } = getChannelMessageFileEndpoints(instance)

        const channelId = "channelId"
        const file = "file"
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('channelId', channelId);

        const result = await addChannelMessageFile(file, channelId);

        expect(postMock).toBeCalledWith(API_SERVICE_ENDPOINTS.CHANNEL_MESSAGE_FILES, bodyFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        expect(result).toEqual(response)
    });

});
