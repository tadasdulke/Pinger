using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class ConnectionInformation
    {
        [Key]
        public int Id { get; set; }
        public string? ConnectionId { get; set; } //DO WE REALLY NEED THIS TO BE NULLABLE
        public string UserId {get;set;}
        public ChatSpace ChatSpace { get; set; }
    }
}