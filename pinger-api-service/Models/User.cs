using Microsoft.AspNetCore.Identity;

namespace pinger_api_service
{
    public class User : IdentityUser
    {
        public virtual ICollection<ChatSpace> ChatSpaces { get; set; }
    }
}