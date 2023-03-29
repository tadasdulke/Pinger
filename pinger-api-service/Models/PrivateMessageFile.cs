namespace pinger_api_service
{
    public class PrivateMessageFile : File
    {
        public User Owner { get; set; }
        public User Receiver { get; set; }
    }
}