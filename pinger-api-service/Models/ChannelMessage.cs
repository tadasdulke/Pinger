namespace pinger_api_service
{
    public class ChannelMessage : Message
    {
        public Channel Channel { get; set; }
        public ICollection<ChannelMessageFile> ChannelMessageFiles { get; set; }
    }
}