import apiClient from '@Api';
import getToken from '../getToken';

describe('getToken', () => {
  const username = 'user';
  const password = 'pass';
  
  test('should return token', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.getToken = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getToken(username, password);
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getToken = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getToken(username, password)).rejects.toThrow(errorMsg);
  });
  
});
