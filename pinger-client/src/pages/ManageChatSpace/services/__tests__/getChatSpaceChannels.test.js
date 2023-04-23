import apiClient from '@Api';

import getChatSpaceChannels from '../getChatSpaceChannels';

describe('getChatSpaceChannels', () => {
  test('should return chatspace channels', async () => {
    const expectedRespone = { status: 200 };
    
    apiClient.getChatSpaceChannels = jest.fn().mockResolvedValue(expectedRespone);
    
    const actualResponse = await getChatSpaceChannels();
    expect(actualResponse).toEqual(expectedRespone);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getChatSpaceChannels = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getChatSpaceChannels()).rejects.toThrow(errorMsg);
  });
});
