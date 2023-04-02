using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class UpdateChannel
    {
        [Required]
        public string Name { get; set; }
    }
}