namespace pinger_api_service
{
    public interface IPrivateMessagesManager
    {
        public Task<PrivateMessage> AddPrivateMessage(string senderId, string receiverId, int chatspaceId, string body, int[] fileIds);
        public Task<PrivateMessage> RemovePrivateMessage(long messageId, string senderId);
        public Task<List<PrivateMessage>> GetPrivateMessagesAfterTime(string receiverId, string senderId, int chatSpaceId, DateTime? lastReadTime);
        public Task<List<PrivateMessage>> GetPrivateMessagesBeforeTime(
            string receiverId, 
            string senderId, 
            int chatSpaceId, 
            DateTime? lastReadTime,
            int offset,
            int skip,
            int step
        );
        public Task<PrivateMessage?> UpdatePrivateMessage(string senderId, long messageId, string body);
    }
}