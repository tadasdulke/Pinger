
namespace pinger_api_service
{
    public class LazyLoadPrivateMessages
    {
        public List<PrivateMessageDto> Messages { get; set; }
        public bool HasMore { get; set; }
    }
}