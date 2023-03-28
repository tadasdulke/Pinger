
namespace pinger_api_service
{
    public class UserDto
    {
        public UserDto(User user) {
            this.Id = user.Id;
            this.UserName = user.UserName;
        }

        public string Id { get; set; }
        public string UserName { get; set; }
    }
}