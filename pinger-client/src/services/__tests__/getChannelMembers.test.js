import apiClient from '@Api';
import getChannelMembers from '../getChannelMembers'

describe('getChannelMembers', () => {
  const channelId = '123';
  
  test('should return channel members without search', async () => {
    const expectedChannelMembers = [
        {
            id: 1,
            userName: 'test'
        }
    ];
    
    apiClient.getChannelMembers = jest.fn().mockResolvedValue(expectedChannelMembers);
    
    const channelMembers = await getChannelMembers(channelId);
    expect(channelMembers).toEqual(expectedChannelMembers);
  });
  
  test('should return channel members with search', async () => {
    const expectedChannelMembers = [
        {
            id: 1,
            userName: 'test'
        }
    ];
    
    apiClient.getChannelMembers = jest.fn().mockResolvedValue(expectedChannelMembers);
    
    const channelMembers = await getChannelMembers(channelId, "search value");
    expect(channelMembers).toEqual(expectedChannelMembers);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.getChannelMembers = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(getChannelMembers(channelId)).rejects.toThrow(errorMsg);
  });
});
