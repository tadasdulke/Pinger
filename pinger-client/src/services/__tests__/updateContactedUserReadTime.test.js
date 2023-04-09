import apiClient from '@Api';
import updateContactedUserReadTime from '../updateContactedUserReadTime'

describe('updateContactedUserReadTime', () => {
  test('should update contacted user read time', async () => {
    const expectedResponse = {
        status: 200,
        data: "updated"
    }
    
    apiClient.updateContactedUserReadTime = jest.fn().mockResolvedValue(expectedResponse);
    
    const response = await updateContactedUserReadTime(1);
    expect(response).toEqual(expectedResponse);
  });
});
