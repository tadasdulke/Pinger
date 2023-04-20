namespace pinger_api_service
{
    public interface IChatSpaceManager
    {
        public Task<ChatSpace?> GetChatSpaceById(int id);
        public Task AddUserToChatspace(ChatSpace chatspace, User userToAdd);
        public Task<List<ChatSpace>> GetUsersChatSpaces(string userId);
        public Task UpdateChatSpace(string name, ChatSpace chatSpace);
        public Task RemoveMember(User member, ChatSpace chatSpace);
        public Task<List<User>?> GetChatSpaceMembers(int chatspaceId);

    }
}