import apiClient from '@Api';
import getChatSpaces from '../getChatSpaces';

describe('getChatSpaces', () => {
  test('should return chat spaces', async () => {
    const expectedRespone = { status: 200, data: [] };
    
    apiClient.getChatSpaces = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getChatSpaces();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getChatSpaces = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getChatSpaces()).rejects.toThrow(errorMsg);
  });
  
});
