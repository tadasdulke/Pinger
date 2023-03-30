namespace pinger_api_service
{
    public interface IPrivateMessagesManager
    {
        public Task<PrivateMessage> AddPrivateMessage(string senderId, string receiverId, int chatspaceId, string body, int[] fileIds);
        public Task<PrivateMessage> RemovePrivateMessage(long messageId, string senderId);
    }
}