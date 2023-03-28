namespace pinger_api_service
{
    public class ChannelDto
    {
        public ChannelDto(Channel channel) {
            this.Id = channel.Id;
        }

        public int Id { get; set; }
    }
}