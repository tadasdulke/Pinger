import { API_SERVICE_ENDPOINTS } from '../config/constants';

import getContactedUsersEndpoints from '../getContactedUsersEndpoints'

describe('getContactedUsersEndpoints', () => {
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
  
    test('should add contacted user', async () => {
        const { addContactedUser } = getContactedUsersEndpoints(instance)

        const contactedUserId = "receiverId"

        const result = await addContactedUser(contactedUserId);

        expect(postMock).toBeCalledWith(API_SERVICE_ENDPOINTS.USERS_CONTACTED_USERS, { contactedUserId }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should return contacted users', async () => {
        const { getContactedUsers } = getContactedUsersEndpoints(instance)


        const result = await getContactedUsers();

        expect(getMock).toBeCalledWith(API_SERVICE_ENDPOINTS.USERS_CONTACTED_USERS, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
  
    test('should return contacted users', async () => {
        const { updateContactedUserReadTime } = getContactedUsersEndpoints(instance)

        const contactedUserId = 'contactedUserId'

        const result = await updateContactedUserReadTime(contactedUserId);

        expect(putMock).toBeCalledWith(`${API_SERVICE_ENDPOINTS.USERS_CONTACTED_USERS}/${contactedUserId}/readtime`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        expect(result).toEqual(response)
    });
});
