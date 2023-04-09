import apiClient from '@Api';
import getChannels from '../getChannels';

describe('getChannels', () => {
  test('should return channels', async () => {
    const expectedChannels = [
        {
            id: 1,
            name: 'some channel'
        }
    ];
    
    apiClient.getChannels = jest.fn().mockResolvedValue(expectedChannels);
    
    const channels = await getChannels("search");
    expect(channels).toEqual(expectedChannels);
  });
});
