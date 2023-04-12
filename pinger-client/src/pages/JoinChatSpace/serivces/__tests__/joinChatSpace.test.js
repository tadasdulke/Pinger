import apiClient from '@Api';
import joinChatSpace from '../joinChatSpace';

describe('joinChatSpace', () => {
    const chatspaceId = 1;
  test('should join chatspace', async () => {
    const expectedRespone = { status: 204 };
    
    apiClient.joinChatSpace = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await joinChatSpace(chatspaceId);
    expect(actualResponse).toEqual(expectedRespone);
    expect(apiClient.joinChatSpace).toBeCalledWith(chatspaceId);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.joinChatSpace = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(joinChatSpace()).rejects.toThrow(errorMsg);
  });
  
});
