import apiClient from '@Api';
import getUnreadPrivateMessages from '../getUnreadPrivateMessages'

describe('getUnreadPrivateMessages', () => {
  test('should return unread private messages', async () => {
    const expectedPrivateMessages = [
        {
            id: 1,
            body: 'message body'
        }
    ];
    
    apiClient.getUnreadPrivateMessages = jest.fn().mockResolvedValue(expectedPrivateMessages);
    
    const messages = await getUnreadPrivateMessages(1,2,3,4);
    expect(messages).toEqual(expectedPrivateMessages);
  });
  
  test('should return null if receiver id is not provided', async () => {
    const messages = await getUnreadPrivateMessages(null,2,3,4);
    expect(messages).toEqual(null);
  });
});
