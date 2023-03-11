using Microsoft.AspNetCore.Identity;

namespace pinger_api_service
{
    public class User : IdentityUser
    {
        public User() {
            this.ChatSpaces = new HashSet<ChatSpace>();
            this.ConnectionInformations = new HashSet<ConnectionInformation>();
        }

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public ICollection<ChatSpace> ChatSpaces { get; set; }

        public ICollection<User> ContactedUsers {get; set;}

        public ICollection<ConnectionInformation> ConnectionInformations {get; set;}
    }
}