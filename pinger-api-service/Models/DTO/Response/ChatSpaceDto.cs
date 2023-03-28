
namespace pinger_api_service
{
    public class ChatSpaceDto
    {
        public ChatSpaceDto(ChatSpace chatspace) {
            this.Id = chatspace.Id;
            this.Name = chatspace.Name;
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}