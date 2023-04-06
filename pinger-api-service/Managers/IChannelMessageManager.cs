namespace pinger_api_service
{
    public interface IChannelMessageManager
    {
        public Task<ChannelMessage> AddChannelMessage(string senderId, int channelId, DateTime sentAt, string body, int[] fileIds);
        public Task RemoveChannelMessage(List<ChannelMessage> channelMessagesToRemove);
        public Task<List<ChannelMessage>> GetChannelMessagesAfterTime(DateTime? lastReadTime, int channelId);
        public Task<List<ChannelMessage>> GetChannelMessagesBeforeTime(DateTime? lastReadTime, int channelId, int offset, int skip, int step);
        public Task<ChannelMessage?> GetChannelMessageAsync(long messageId, string userId);
        public Task UpdateChannelMessageAsync(ChannelMessage channelMessage, string body);

    }
}