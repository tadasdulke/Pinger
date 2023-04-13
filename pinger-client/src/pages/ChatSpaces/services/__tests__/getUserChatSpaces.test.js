import apiClient from '@Api';
import getUserChatSpaces from '../getUserChatSpaces'

describe('getUserChatSpaces', () => {
  test('should get user chatspaces', async () => {
    const expectedResult = { status: 200 };
    
    apiClient.getUserChatSpaces = jest.fn().mockResolvedValue(expectedResult);
    
    const actualResponse = await getUserChatSpaces();
    expect(actualResponse).toEqual(expectedResult);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getUserChatSpaces = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getUserChatSpaces()).rejects.toThrow(errorMsg);
  });
  
});
