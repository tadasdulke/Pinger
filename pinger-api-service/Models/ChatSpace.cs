
using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class ChatSpace
    {
        public ChatSpace() {
            this.Members = new HashSet<User>();
        }
        
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public ICollection<User> Members { get; set; }
    }
}