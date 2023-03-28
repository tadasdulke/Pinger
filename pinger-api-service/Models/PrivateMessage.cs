namespace pinger_api_service
{
    public class PrivateMessage : Message
    {
        public User Receiver { get; set; }
        public ChatSpace ChatSpace { get; set; }
        public ICollection<PrivateMessageFile> PrivateMessageFiles { get; set; }
    }
}