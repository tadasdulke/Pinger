
using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class ChatSpace
    {
        public ChatSpace() {
            this.Members = new HashSet<User>();
            this.InvitedUsers = new HashSet<User>();
        }
        
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public bool Private { get; set; }
        public string OwnerId {get; set;}
        public User Owner { get; set; }
        public ICollection<User> Members { get; set; }
        public ICollection<User> InvitedUsers { get; set; }
        public ICollection<Channel> Channel { get; set; }
    }
}