using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace pinger_api_service
{
    public class ChatSpace
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public User? Owner { get; set; }
    }
}