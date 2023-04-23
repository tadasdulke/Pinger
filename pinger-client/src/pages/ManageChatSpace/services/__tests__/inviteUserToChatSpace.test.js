import apiClient from '@Api';

import inviteUserToChatSpace from '../inviteUserToChatSpace';

describe('inviteUserToChatSpace', () => {
  test('should return invited users', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.inviteUserToChatSpace = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await inviteUserToChatSpace();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.inviteUserToChatSpace = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(inviteUserToChatSpace()).rejects.toThrow(errorMsg);
  });
});
