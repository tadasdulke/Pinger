import apiClient from '@Api';

import getInvitedUsers from '../getInvitedUsers';

describe('getInvitedUsers', () => {
  test('should return invited users', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.getInvitedUsers = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getInvitedUsers();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getInvitedUsers = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getInvitedUsers()).rejects.toThrow(errorMsg);
  });
});
