
namespace pinger_api_service
{
    public class LazyLoadChannelMessages
    {
        public List<ChannelMessageDto> Messages { get; set; }
        public bool HasMore { get; set; }
    }
}