using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PingerChatHub.Hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine("--> Connection Opened: " + Context.ConnectionId);
            // Clients.Client(Context.ConnectionId).SendAsync("ReceiveConnID", Context.ConnectionId);
            return base.OnConnectedAsync();
        }


        public async Task SendMessage(string user)
        {
            Console.WriteLine("--> New message received: " + user);
            await Clients.All.SendAsync("ReceiveMessage", user);
        }
    }
}
