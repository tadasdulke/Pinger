namespace pinger_api_service
{
    public interface IChannelMessageManager
    {
        public Task<ChannelMessage> AddChannelMessage(string senderId, int channelId, DateTime sentAt, string body, int[] fileIds);
    }
}