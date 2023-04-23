import apiClient from '@Api';

import removeChatSpaceMember from '../removeChatSpaceMember';

describe('removeChatSpaceMember', () => {
  test('should remove member', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.removeChatSpaceMember = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await removeChatSpaceMember();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.removeChatSpaceMember = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(removeChatSpaceMember()).rejects.toThrow(errorMsg);
  });
});
