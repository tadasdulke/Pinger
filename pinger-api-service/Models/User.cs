using Microsoft.AspNetCore.Identity;

namespace pinger_api_service
{
    public class User : IdentityUser
    {
        public User() {
            this.ChatSpaces = new HashSet<ChatSpace>();
        }

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public ICollection<ChatSpace> ChatSpaces { get; set; }
    }
}