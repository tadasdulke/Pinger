using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class ContactedUserInfo
    {
        [Key]
        public int Id { get; set; }
        public User Owner { get; set; }
        public DateTime? LastReadTime { get; set; }
        public User? ContactedUser { get; set; }
        public ChatSpace? ChatSpace { get; set; }
    }
}