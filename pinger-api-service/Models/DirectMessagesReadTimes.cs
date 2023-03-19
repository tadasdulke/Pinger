using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class DirectMessagesReadTimes
    {
        [Key]
        public int Id { get; set; }
        public User Owner { get; set; }
        public DateTime ReadTime { get; set; }
        public User Receiver { get; set; }
    }
}