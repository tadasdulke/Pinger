using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class TokenRefreshRequest
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}