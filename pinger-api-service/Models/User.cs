using Microsoft.AspNetCore.Identity;

namespace pinger_api_service
{
    public class User : IdentityUser
    {
        public User() {
            this.ChatSpaces = new HashSet<ChatSpace>();
        }

        public ICollection<ChatSpace> ChatSpaces { get; set; }
    }
}