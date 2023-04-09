import apiClient from '@Api';
import getChannel from '../getChannel';

describe('getChannel', () => {
  const channelId = '123';
  
  test('should return channel', async () => {
    const expectedChannelData = { name: 'Channel name' };
    
    apiClient.getChannel = jest.fn().mockResolvedValue(expectedChannelData);
    
    const actualChannelData = await getChannel(channelId);
    expect(actualChannelData).toEqual(expectedChannelData);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getChannel = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getChannel(channelId)).rejects.toThrow(errorMsg);
  });
  
});
