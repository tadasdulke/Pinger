using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class PrivateMessage
    {
        [Key]
        public Int64 Id { get; set; }
        public User Receiver { get; set; }
        public User Sender { get; set; }
        public ChatSpace ChatSpace { get; set; }
        public DateTime SentAt { get; set; }
        public string Body {get; set;}
    }
}