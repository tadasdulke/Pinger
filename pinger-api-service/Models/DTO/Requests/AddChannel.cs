using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class AddChannel
    {
        public AddChannel() {
            this.MemberIds = new List<string>();
        }

        [Required]
        public string Name { get; set; }
        public ICollection<string> MemberIds { get; set; }
    }
}