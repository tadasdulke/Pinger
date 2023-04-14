import apiClient from '@Api';

import updateSelf from '../updateSelf';

describe('updateSelf', () => {
  test('should update self', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.updateSelf = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await updateSelf();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.updateSelf = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(updateSelf()).rejects.toThrow(errorMsg);
  });
});
