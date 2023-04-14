import apiClient from '@Api';
import removePrivateMessage from '../removePrivateMessage'

describe('removePrivateMessage', () => {
  const messageId = 4
  
  test('should remove pirvate message', async () => {
    const expectedResult = { status: 204 };
    
    apiClient.removePrivateMessage = jest.fn().mockResolvedValue(expectedResult);
    
    const actualResponse = await removePrivateMessage(messageId);
    expect(actualResponse).toEqual(expectedResult);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.removePrivateMessage = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(removePrivateMessage(messageId)).rejects.toThrow(errorMsg);
  });
  
});
