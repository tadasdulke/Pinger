import apiClient from '@Api';
import searchChatSpaceMembers from '../searchChatSpaceMembers'

describe('searchChatSpaceMembers', () => {
  test('should return chatspace members', async () => {
    const expectedChatspaceMembers = [
        {
            id: 1,
            username: 'test'
        }
    ];
    
    apiClient.searchChatSpaceMembers = jest.fn().mockResolvedValue(expectedChatspaceMembers);
    
    const members = await searchChatSpaceMembers("search");
    expect(members).toEqual(expectedChatspaceMembers);
  });
});
