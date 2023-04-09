import apiClient from '@Api';
import getUnreadChannelMessages from '../getUnreadChannelMessages';

describe('getUnreadChannelMessages', () => {
  test('should return unread channel messages', async () => {
    const expectedPrivateMessages = [
        {
            id: 1,
            body: 'message body'
        }
    ];
    
    apiClient.getUnreadChannelMessages = jest.fn().mockResolvedValue(expectedPrivateMessages);
    
    const messages = await getUnreadChannelMessages(1,2,3,4);
    expect(messages).toEqual(expectedPrivateMessages);
  });
  
  test('should return null if receiver id is not provided', async () => {
    const messages = await getUnreadChannelMessages(null,2,3,4);
    expect(messages).toEqual(null);
  });
});
