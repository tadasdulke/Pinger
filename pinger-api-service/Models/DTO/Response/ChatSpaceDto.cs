
namespace pinger_api_service
{
    public class ChatSpaceDto
    {
        public ChatSpaceDto(ChatSpace chatspace) {
            this.Id = chatspace.Id;
            this.Name = chatspace.Name;
            if(chatspace.Owner is not null) {
                this.Owner = new UserDto(chatspace.Owner);
            } 
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public UserDto Owner { get; set; }
    }
}