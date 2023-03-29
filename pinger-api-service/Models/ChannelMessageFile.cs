namespace pinger_api_service
{
    public class ChannelMessageFile : File
    {
        public User Owner { get; set; }
        public Channel Channel { get; set; }
    }
}