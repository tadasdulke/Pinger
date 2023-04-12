import apiClient from '@Api';
import handleRegistration from '../handleRegistration';

describe('handleRegistration', () => {
  const username = 'user';
  const email = 'email';
  const password = 'password';
  
  test('should register user', async () => {
    const expectedResponse = { status: 204 };
    
    apiClient.handleRegistration = jest.fn().mockResolvedValue(expectedResponse);
    
    const actualResponse = await handleRegistration(email, username, password);
    expect(actualResponse).toEqual(expectedResponse);
  });
  
  test('should return error', async () => {
    const errorMsg = "Request failed"
    apiClient.handleRegistration = jest.fn().mockRejectedValue(new Error(errorMsg));
    
    await expect(handleRegistration(email, username, password)).rejects.toThrow(errorMsg);
  });
  
});
