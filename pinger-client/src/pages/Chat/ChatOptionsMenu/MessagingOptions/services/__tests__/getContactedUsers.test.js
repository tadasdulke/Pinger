import apiClient from '@Api';
import getContactedUsers from '../getContactedUsers';

describe('getContactedUsers', () => {
  test('should return contacted users', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.getContactedUsers = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getContactedUsers();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getContactedUsers = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getContactedUsers()).rejects.toThrow(errorMsg);
  });
  
});
