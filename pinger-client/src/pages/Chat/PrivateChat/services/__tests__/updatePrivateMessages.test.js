import apiClient from '@Api';
import updatePrivateMessage from '../updatePrivateMessage'

describe('updatePrivateMessage', () => {
  const messageId = 4
  const messageBody = "howdy"
  
  test('should update private message', async () => {
    const expectedResult = { status: 204 };
    
    apiClient.updatePrivateMessage = jest.fn().mockResolvedValue(expectedResult);
    
    const actualResponse = await updatePrivateMessage(messageId, messageBody);
    expect(actualResponse).toEqual(expectedResult);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.updatePrivateMessage = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(updatePrivateMessage(messageId, messageBody)).rejects.toThrow(errorMsg);
  });
  
});
