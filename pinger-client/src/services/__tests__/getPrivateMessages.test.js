import apiClient from '@Api';
import getPrivateMessages from '../getPrivateMessages';

describe('getPrivateMessages', () => {
  test('should return private messages', async () => {
    const expectedPrivateMessages = [
        {
            id: 1,
            body: 'message body'
        }
    ];
    
    apiClient.getPrivateMessages = jest.fn().mockResolvedValue(expectedPrivateMessages);
    
    const messages = await getPrivateMessages(1,2,3,4);
    expect(messages).toEqual(expectedPrivateMessages);
  });
  
  test('should return null if receiver id is not provided', async () => {
    const messages = await getPrivateMessages(null,2,3,4);
    expect(messages).toEqual(null);
  });
});
