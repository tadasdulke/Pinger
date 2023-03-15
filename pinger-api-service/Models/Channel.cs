using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class Channel
    {
        [Key]
        public int Id { get; set; }
        public string Name {get;set;}
        public string OwnerId { get; set; }
        public User Owner { get; set; }
        public ChatSpace ChatSpace { get; set; }
        public ICollection<User> Members {get; set;}
        public ICollection<ChannelMessage> Messages {get; set;}
    }
}