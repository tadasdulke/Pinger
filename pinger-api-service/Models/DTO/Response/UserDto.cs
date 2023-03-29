
namespace pinger_api_service
{
    public class UserDto
    {
        public UserDto(User user) {
            this.Id = user.Id;
            this.UserName = user.UserName;
            if(user.ProfileImageFile is not null) {
                this.ProfilePictureId = user.ProfileImageFile.Id;
            }
        }

        public string Id { get; set; }
        public string UserName { get; set; }
        public int? ProfilePictureId { get; set; }
    }
}