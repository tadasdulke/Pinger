namespace pinger_api_service
{
    public class PrivateUnreadMessages
    {
        public PrivateUnreadMessages(List<PrivateMessage> messages, bool alreadyInteracted) { 
            this.UnreadMessages = messages.Select(m => new PrivateMessageDto(m)).ToList();
            this.AlreadyInteracted = alreadyInteracted;
        }
        public List<PrivateMessageDto> UnreadMessages { get; set; }
        public bool AlreadyInteracted { get; set; }

    }
}