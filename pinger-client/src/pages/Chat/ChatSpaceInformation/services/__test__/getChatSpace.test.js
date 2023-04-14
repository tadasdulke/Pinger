import apiClient from '@Api';

import getChatSpace from '../getChatSpace';

describe('getChatSpace', () => {
  test('should return chat space', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.getChatSpace = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getChatSpace();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getChatSpace = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getChatSpace()).rejects.toThrow(errorMsg);
  });
});
