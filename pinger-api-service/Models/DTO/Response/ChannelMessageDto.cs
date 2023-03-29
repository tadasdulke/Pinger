
namespace pinger_api_service
{
    public class ChannelMessageDto
    {
        public ChannelMessageDto(ChannelMessage channelMessage) {
            this.Id = channelMessage.Id;
            this.Sender = new UserDto(channelMessage.Sender);
            this.Channel = new ChannelDto(channelMessage.Channel);
            this.SentAt = channelMessage.SentAt;
            this.Body = channelMessage.Body;
            this.Edited = channelMessage.Edited;
            this.Files = channelMessage.ChannelMessageFiles.Select(cmf => new ChannelMessageFileDto(cmf)).ToList();
        }

        public long Id { get; set; }
        public UserDto Sender {get;set;}
        public ChannelDto Channel { get; set; }
        public DateTime SentAt { get; set; }
        public string Body {get; set;}
        public bool Edited { get; set; }
        public List<ChannelMessageFileDto> Files { get; set; }
    }
}