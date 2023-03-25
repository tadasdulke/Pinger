using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class PrivateMessage
    {
        public PrivateMessage() {
            this.Edited = false;
        }

        [Key]
        public Int64 Id { get; set; }
        public User Receiver { get; set; }
        public User Sender { get; set; }
        public ChatSpace ChatSpace { get; set; }
        public DateTime SentAt { get; set; }
        public bool Edited { get; set; }
        public string Body {get; set;}
        public ICollection<PrivateMessageFile> PrivateMessageFiles { get; set; }
    }
}