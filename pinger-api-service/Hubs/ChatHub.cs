using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Authorize]
    public class ChatHub : Hub 
    {
        private readonly ApplicationUserManager _userManager;
        private IChatSpaceManager _chatSpaceManager;
        private ApplicationDbContext _dbContext;
        private IPrivateMessagesManager _privateMessageManager;

        public ChatHub(
            ApplicationDbContext dbContext,
            ApplicationUserManager userManager,
            IChatSpaceManager chatSpaceManager,
            IPrivateMessagesManager privateMessageManager
        )
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _chatSpaceManager = chatSpaceManager;
            _privateMessageManager = privateMessageManager;
        }

        public override async Task OnConnectedAsync() 
        {
            string userId = _userManager.GetUserId(Context.User);
            int chatSpaceId = _userManager.GetChatSpaceId(Context.User);

            ChatSpace currentChatSpace = _chatSpaceManager.GetChatSpaceById(chatSpaceId);
            User user = await _userManager.FindByIdAsync(userId);
            
            ConnectionInformation ct = new ConnectionInformation();
            ct.ConnectionId = Context.ConnectionId;
            ct.ChatSpace = currentChatSpace;
            user.ConnectionInformations.Add(ct);
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
            int chatspaceId = _userManager.GetChatSpaceId(Context.User);
            string senderId = _userManager.GetUserId(Context.User);
            
            User receiver = await _userManager.Users.Include(u => u.ConnectionInformations).ThenInclude(ci => ci.ChatSpace).FirstOrDefaultAsync(u => u.Id == receiverId);
            List<ConnectionInformation> filteredConnectionInformations = receiver.ConnectionInformations.Where(ci => ci.ChatSpace.Id == chatspaceId).ToList();
            
            var sentMessage = await _privateMessageManager.AddPrivateMessage(senderId, receiverId, chatspaceId, message);

            foreach(ConnectionInformation connectionInfo in filteredConnectionInformations) {
                await Clients.Client(connectionInfo.ConnectionId).SendAsync("ReceiveMessage", sentMessage);   
            }
        }
    }
} 