namespace pinger_api_service
{
    public class ChannelUnreadMessages
    {
        public ChannelUnreadMessages(List<ChannelMessage> messages, bool alreadyInteracted) { 
            this.UnreadMessages = messages.Select(m => new ChannelMessageDto(m)).ToList();
            this.AlreadyInteracted = alreadyInteracted;
        }
        public List<ChannelMessageDto> UnreadMessages { get; set; }
        public bool AlreadyInteracted { get; set; }

    }
}