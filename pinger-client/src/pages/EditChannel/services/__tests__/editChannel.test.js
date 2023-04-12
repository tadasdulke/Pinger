import apiClient from '@Api';
import editChannel from '../editChannel';

describe('editChannel', () => {
  const channelId = '123';
  const channelName = "name"
  
  test('should edit channel', async () => {
    const expectedChannelData = { status: 204 };
    
    apiClient.editChannel = jest.fn().mockResolvedValue(expectedChannelData);
    
    const actualChannelData = await editChannel(channelId, channelName);
    expect(actualChannelData).toEqual(expectedChannelData);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.editChannel = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(editChannel(channelId, channelName)).rejects.toThrow(errorMsg);
  });
  
});
