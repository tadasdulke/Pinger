using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class UpdateChatSpace
    {
        [Required]
        public string Name { get; set; }
    }
}