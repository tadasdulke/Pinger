import apiClient from '@Api';

import getSelf from '../getSelf';

describe('getSelf', () => {
  test('should return self', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.getSelf = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getSelf();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getSelf = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getSelf()).rejects.toThrow(errorMsg);
  });
});
