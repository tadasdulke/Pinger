import apiClient from '@Api';
import revokeToken from '../revokeToken';

describe('revokeToken', () => {
  test('should return revoke token', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.revokeToken = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await revokeToken();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.revokeToken = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(revokeToken()).rejects.toThrow(errorMsg);
  });
  
});
