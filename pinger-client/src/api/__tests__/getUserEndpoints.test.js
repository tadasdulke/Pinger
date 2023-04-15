import { API_SERVICE_ENDPOINTS } from '../config/constants';
import getUserEndpoints from '../getUserEndpoints';

describe('getUserEndpoints', () => {
    const response = {
        status: 200,
        data: "test"
    }

    const getMock = jest.fn().mockResolvedValue(response);
    const putMock = jest.fn().mockResolvedValue(response);

    const instance = {
        get: getMock,
        put: putMock
    }
  
    test('should return self ', async () => {
        const { getSelf } = getUserEndpoints(instance)

        const result = await getSelf();

        expect(getMock).toBeCalledWith(API_SERVICE_ENDPOINTS.USERS, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        expect(result).toEqual(response)
    });
  
    test('should update self ', async () => {
        const { updateSelf } = getUserEndpoints(instance)

        const file = 'testfile';
        const username = 'test';

        const bodyFormData = new FormData();
        bodyFormData.append('profileImage', file)
        bodyFormData.append('username', username)
        
        const result = await updateSelf(file, username);

        expect(putMock).toBeCalledWith(API_SERVICE_ENDPOINTS.USERS, bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        expect(result).toEqual(response)
    });
});
