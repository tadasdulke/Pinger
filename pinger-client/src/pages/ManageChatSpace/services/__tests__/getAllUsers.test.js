import apiClient from '@Api';

import getAllUsers from '../getAllUsers';

describe('getAllUsers', () => {
  test('should return all users', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.getAllUsers = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getAllUsers();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getAllUsers = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getAllUsers()).rejects.toThrow(errorMsg);
  });
});
