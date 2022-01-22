using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PingerChatHub.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user)
        {
            await Clients.All.SendAsync("ReceiveMessage", user);
        }
    }
}
