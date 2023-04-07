namespace pinger_api_service
{
    public interface IChatSpaceManager
    {
        public Task<ChatSpace?> GetChatSpaceById(int id);
        public Task AddUserToChatspace(ChatSpace chatspace, User userToAdd);
        public Task<List<ChatSpace>> GetUsersChatSpaces(string userId);

    }
}