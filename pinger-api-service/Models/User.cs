using Microsoft.AspNetCore.Identity;

namespace pinger_api_service
{
    public class User : IdentityUser
    {
        public User() {
            this.ChatSpaces = new HashSet<ChatSpace>();
            this.InvitedChatSpaces = new HashSet<ChatSpace>();
            this.OwnedChatSpaces = new HashSet<ChatSpace>();
            this.ConnectionInformations = new HashSet<ConnectionInformation>();
            this.Channels = new HashSet<Channel>();
        }

        public string? RefreshToken { get; set; }
        public File? ProfileImageFile { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public ICollection<ChatSpace> ChatSpaces { get; set; }
        public ICollection<ChatSpace> InvitedChatSpaces { get; set; }
        public ICollection<ChatSpace> OwnedChatSpaces { get; set; }
        public ICollection<ContactedUserInfo> ContactedUsersInfo {get; set;}
        public ICollection<ConnectionInformation> ConnectionInformations {get; set;}
        public ICollection<Channel> Channels {get; set;}
        public ICollection<Channel> OwnedChannels {get; set;}
    }
}