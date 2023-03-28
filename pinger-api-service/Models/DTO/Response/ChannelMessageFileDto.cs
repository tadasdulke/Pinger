
namespace pinger_api_service
{
    public class ChannelMessageFileDto
    {
        public ChannelMessageFileDto(ChannelMessageFile channelMessageFile) {
            this.Id = channelMessageFile.Id;
            this.Name = channelMessageFile.Name;
        }
        
        public int Id { get; set; }
        public string Name { get; set; }
    }
}