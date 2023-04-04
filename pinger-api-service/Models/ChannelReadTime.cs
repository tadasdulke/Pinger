using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class ChannelReadTime
    {
        [Key]
        public int Id { get; set; }
        public User Owner { get; set; }
        public DateTime? LastReadTime { get; set; }
        public Channel? Channel { get; set; } //remove nulable
    }
}