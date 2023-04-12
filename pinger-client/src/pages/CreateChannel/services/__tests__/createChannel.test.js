import apiClient from '@Api';
import createChannel from '../createChannel';

describe('createChannel', () => {
  const channelName = "name"
  
  test('should edit channel', async () => {
    const expectedChannelData = { status: 204 };
    
    apiClient.createChannel = jest.fn().mockResolvedValue(expectedChannelData);
    
    const actualChannelData = await createChannel(channelName);
    expect(actualChannelData).toEqual(expectedChannelData);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.createChannel = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(createChannel(channelName)).rejects.toThrow(errorMsg);
  });
  
});
