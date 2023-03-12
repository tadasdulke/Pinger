namespace pinger_api_service
{
    public interface IPrivateMessagesManager
    {
        public List<PrivateMessage> GetPrivateMessages(string senderId, string receiverId, int chatspaceId);
        public Task<PrivateMessage> AddPrivateMessage(string senderId, string receiverId, int chatspaceId, string body);
    }
}