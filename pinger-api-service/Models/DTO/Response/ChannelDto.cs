namespace pinger_api_service
{
    public class ChannelDto
    {
        public ChannelDto(Channel channel) {
            this.Id = channel.Id;
            this.Name = channel.Name;
            
            if(channel.ChatSpace is not null) {
                this.ChatSpace = new ChatSpaceDto(channel.ChatSpace);
            }

            if(channel.Owner is not null) {
                this.Owner = new UserDto(channel.Owner);
            }
        }

        public int Id { get; set; }
        public UserDto Owner { get; set; }
        public string Name { get; set; }
        public ChatSpaceDto ChatSpace {get;set;}
    }
}