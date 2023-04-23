import apiClient from '@Api';

import updateChatSpace from '../updateChatSpace';

describe('updateChatSpace', () => {
  test('should update chatspace', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.updateChatSpace = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await updateChatSpace();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.updateChatSpace = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(updateChatSpace()).rejects.toThrow(errorMsg);
  });
});
