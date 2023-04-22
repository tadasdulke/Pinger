using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class AddChannel
    {
        [Required]
        public string Name { get; set; }
        public bool Private { get; set; }
    }
}