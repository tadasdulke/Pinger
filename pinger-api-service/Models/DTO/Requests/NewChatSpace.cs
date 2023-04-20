using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class NewChatSpace
    {
        [Required(ErrorMessage = "ChatSpace name is required")]
        public string? Name { get; set; }
        public bool Private { get; set; }
    }
}