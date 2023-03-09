using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Authorize]
    public class ChatHub : Hub 
    {
        private readonly UserManager<User> _userManager;
        private ApplicationDbContext _dbContext;

        public ChatHub(ApplicationDbContext dbContext, UserManager<User> userManager)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        public override async Task OnConnectedAsync() 
        {
            string userId = _userManager.GetUserId(Context.User);
            User user = await _userManager.FindByIdAsync(userId);
            var userConnections = user.ConnectionInformations;
            ConnectionInformation ct = new ConnectionInformation();
            ct.ConnectionId = Context.ConnectionId;
            userConnections.Add(ct);
            await _userManager.UpdateAsync(user);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception) 
        {
            string userId = _userManager.GetUserId(Context.User);
            User user = await _userManager.Users.Include(u => u.ConnectionInformations).FirstOrDefaultAsync(u => u.Id == userId);
            var userConnections = user.ConnectionInformations;
            ConnectionInformation? connectionInfoToRemove = userConnections.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);

            if(connectionInfoToRemove is not null) 
            {
                userConnections.Remove(connectionInfoToRemove);
                user.ConnectionInformations = userConnections;
                await _userManager.UpdateAsync(user);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendPrivateMessage(string receiverId, string message)
        {
            User user = await _userManager.Users.Include(u => u.ConnectionInformations).FirstOrDefaultAsync(u => u.Id == receiverId);

            foreach(ConnectionInformation connectionInfo in user.ConnectionInformations) {
                await Clients.Client(connectionInfo.ConnectionId).SendAsync("ReceiveMessage", message);   
            }
        }
    }
} 