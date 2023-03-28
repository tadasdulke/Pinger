
namespace pinger_api_service
{
    public class PrivateMessageDto
    {
        public PrivateMessageDto(PrivateMessage privateMessage) {
            this.Id = privateMessage.Id;
            this.Receiver = new UserDto(privateMessage.Receiver);
            this.Sender = new UserDto(privateMessage.Sender);
            this.SentAt = privateMessage.SentAt;
            this.Edited = privateMessage.Edited;
            this.Body = privateMessage.Body;
            this.Files = privateMessage.PrivateMessageFiles.Select(pmf => new PrivateMessageFileDto(pmf)).ToList();
        }

        public Int64 Id { get; set; }
        public UserDto Receiver { get; set; }
        public UserDto Sender { get; set; }
        public DateTime SentAt { get; set; }
        public bool Edited { get; set; }
        public string Body {get; set;}
        public List<PrivateMessageFileDto> Files { get; set; }

    }
}