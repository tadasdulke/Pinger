
namespace pinger_api_service
{
    public class ContactedUserInfoDto
    {
        public ContactedUserInfoDto(ContactedUserInfo contactedUserInfo, bool existsInChatSpace = false) {
            this.ContactedUser = new UserDto(contactedUserInfo.ContactedUser);
            this.ExistsInChatSpace = existsInChatSpace;
        }

        public UserDto ContactedUser { get; set; }
        public bool ExistsInChatSpace { get;set;}
    }
}