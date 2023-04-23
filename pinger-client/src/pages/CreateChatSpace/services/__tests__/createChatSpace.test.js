import apiClient from '@Api';
import createChatSpace from '../createChatSpace';

describe('createChatSpace', () => {
    const chatSpaceName = "test";
  test('should create chatspace', async () => {
    const expectedRespone = { status: 204 };
    
    apiClient.createChatSpace = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await createChatSpace(chatSpaceName, false);
    expect(actualResponse).toEqual(expectedRespone);
    expect(apiClient.createChatSpace).toBeCalledWith(chatSpaceName, false);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.createChatSpace = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(createChatSpace(chatSpaceName)).rejects.toThrow(errorMsg);
  });
  
});
