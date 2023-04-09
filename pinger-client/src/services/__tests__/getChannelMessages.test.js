import apiClient from '@Api';
import getChannelMessages from '../getChannelMessages';

describe('getChannelMessages', () => {
  test('should return channel messages', async () => {
    const exptectedMessages = [
        {
            id: 1,
            body: 'test'
        }
    ];
    
    apiClient.getChannelMessages = jest.fn().mockResolvedValue(exptectedMessages);
    
    const messages = await getChannelMessages(1, 1, 1, 1);
    expect(messages).toEqual(exptectedMessages);
  });
});
