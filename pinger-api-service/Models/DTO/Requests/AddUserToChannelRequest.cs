using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class AddUserToChannelRequest
    {
        public string NewMemberId { get; set; }
    }
}