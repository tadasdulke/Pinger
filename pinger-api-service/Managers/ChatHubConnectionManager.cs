using Microsoft.AspNetCore.SignalR;

namespace pinger_api_service
{
    public interface IChatHubConnectionManager {
        public Task AddUserConnectionToChannelAsync(List<ConnectionInformation> connectionInformation, Channel channel);
        public Task NotifyRemovedFromChannelUsers (Channel channel, List<User> members);
        public Task NotifyUserAddedToChannel(Channel channel, User user); 
        public Task NotifyUserRemovedMessage(Channel channel, User user, ChannelMessage channelMessage);
        public Task NotifyUserUpdatedMessage(Channel channel, User user, ChannelMessage channelMessage);
    }

    public class ChatHubConnectionManager : IChatHubConnectionManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConnectionInformationManager _connectionInformationManager;
        private readonly ApplicationUserManager _userManager;
        private readonly IHubContext<ChatHub> _chatHubContext;


        public ChatHubConnectionManager(
            ApplicationDbContext dbContext, 
            ApplicationUserManager userManager, 
            IHubContext<ChatHub> chatHubContext,
            IConnectionInformationManager connectionInformationManager
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatHubContext = chatHubContext;
            _connectionInformationManager = connectionInformationManager;
        }

        public async Task AddUserConnectionToChannelAsync(List<ConnectionInformation> connectionInformation, Channel channel) {
            string groupName = $"{channel.Id}-{channel.Name}";
            
            List<string> connectionIds = connectionInformation.Select(ci => ci.ConnectionId).ToList();

            foreach(string connectionId in connectionIds) {
                await _chatHubContext.Groups.AddToGroupAsync(connectionId, groupName);
            }
        }

        public async Task NotifyRemovedFromChannelUsers (Channel channel, List<User> members)
        {
            List<string> connectionIds = _connectionInformationManager.GetUsersConnectionInfo(members.ToList());
            
            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("UserRemovedFromChannel", new ChannelDto(channel));
        }

        public async Task NotifyUserAddedToChannel(Channel channel, User user) 
        {
            List<string> connectionIds = _connectionInformationManager.GetUsersConnectionInfo(new List<User>{user});
            string groupName = $"{channel.Id}-{channel.Name}";
            
            foreach(string connectionId in connectionIds) {
                await _chatHubContext.Groups.AddToGroupAsync(connectionId, groupName);
            }

            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("UserAddedToChannel", new ChannelDto(channel));
        }

        public async Task NotifyUserRemovedMessage(Channel channel, User user, ChannelMessage channelMessage) 
        {
            List<string> connectionIds = _connectionInformationManager.GetUsersConnectionInfo(new List<User>{user});
            string groupName = $"{channel.Id}-{channel.Name}";

            await _chatHubContext.Clients.GroupExcept(groupName, connectionIds).SendAsync("RemoveChannelMessage", new ChannelMessageDto(channelMessage));
        }

        public async Task NotifyUserUpdatedMessage(Channel channel, User user, ChannelMessage channelMessage) 
        {
            List<string> connectionIds = _connectionInformationManager.GetUsersConnectionInfo(new List<User>{user});
            string groupName = $"{channel.Id}-{channel.Name}";

            await _chatHubContext.Clients.GroupExcept(groupName, connectionIds).SendAsync("ChannelMessageUpdated", new ChannelMessageDto(channelMessage));
        }
    }
}