using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pinger_api_service
{
    public class ChannelMessage
    {
        [Key]
        public int Id { get; set; }
        public User Sender {get;set;}
        public Channel Channel { get; set; }
        public DateTime SentAt { get; set; }
        public string Body {get; set;}
        public ICollection<ChannelMessageFile> ChannelMessageFiles { get; set; }
    }
}