import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getPrivateMessageFileEndpoints from '../getPrivateMessageFileEndpoints'

describe('getPrivateMessageFileEndpoints', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const postMock = jest.fn().mockResolvedValue(response);

    const instance = {
        post: postMock,
    }
  
    test('should return private messages', async () => {
        const { addPrivateMessageFile } = getPrivateMessageFileEndpoints(instance)

        const receiverId = "receiverId"
        const file = 'file';

        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('receiverId', receiverId);

        const result = await addPrivateMessageFile(file, receiverId);

        expect(postMock).toBeCalledWith(API_SERVICE_ENDPOINTS.PRIVATE_MESSAGE_FILES, bodyFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        expect(result).toEqual(response)
    });
});
