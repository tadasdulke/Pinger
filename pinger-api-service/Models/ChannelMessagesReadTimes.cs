using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class ChannelMessagesReadTimes
    {
        [Key]
        public int Id  { get; set; }
        public User Owner { get; set; }
        public DateTime ReadTime { get; set; }
        public Channel Channel { get; set; }
    }
}