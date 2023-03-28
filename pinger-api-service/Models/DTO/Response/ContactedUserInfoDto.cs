
namespace pinger_api_service
{
    public class ContactedUserInfoDto
    {
        public ContactedUserInfoDto(ContactedUserInfo contactedUserInfo) {
            this.ContactedUser = new UserDto(contactedUserInfo.ContactedUser);
        }

        public UserDto ContactedUser { get; set; }
    }
}