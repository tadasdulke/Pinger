import apiClient from '@Api';
import appendClaims from '../appendClaims'

describe('appendClaims', () => {
  const chatSpaceId = 4
  
  test('should append claims', async () => {
    const expectedResult = { status: 204 };
    
    apiClient.appendClaims = jest.fn().mockResolvedValue(expectedResult);
    
    const actualResponse = await appendClaims(chatSpaceId);
    expect(actualResponse).toEqual(expectedResult);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.appendClaims = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(appendClaims(chatSpaceId)).rejects.toThrow(errorMsg);
  });
  
});
