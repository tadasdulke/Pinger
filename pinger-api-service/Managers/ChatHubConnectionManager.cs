using Microsoft.AspNetCore.SignalR;

namespace pinger_api_service
{
    public interface IChatHubConnectionManager {
        public Task AddUserConnectionToChannelAsync(List<ConnectionInformation> connectionInformation, Channel channel);
        public Task NotifyRemovedFromChannelUsers (Channel channel, List<User> members);
        public Task NotifyUserAddedToChannel(Channel channel, User user); 
        public Task NotifyUserRemovedMessage(Channel channel, User user, ChannelMessage channelMessage);
        public Task NotifyUserUpdatedMessage(Channel channel, User user, ChannelMessage channelMessage);
        public Task NotifyUserPrivateMessageRemoved(PrivateMessage privateMessage);
        public Task NotifyUserPrivateMessageUpdated(PrivateMessage editedMessage);
        public Task NotifyError(string connectionId, string error);
        public Task NotifyUserNewContactAdded(string[] connectionIds, ContactedUserInfo contactedUserInfo); 
        public Task NotifyUserPrivateMessageReceived(string[] connectionIds, PrivateMessage privateMessage); 
        public Task NotifyUserMessageSent(string connectionId, PrivateMessage privateMessage);
        public Task NotifyChannelReceivedMessage(Channel channel, User sender, ChannelMessage channelMessage);
        public Task NotifyUserChannelMessageSent(string connectionId, ChannelMessage channelMessage); 
    }

    public class ChatHubConnectionManager : IChatHubConnectionManager
    {
        private readonly IConnectionInformationManager _connectionInformationManager;
        private readonly IHubContext<ChatHub> _chatHubContext;


        public ChatHubConnectionManager(
            IHubContext<ChatHub> chatHubContext,
            IConnectionInformationManager connectionInformationManager
        )
        {
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

        public async Task NotifyChannelReceivedMessage(Channel channel, User sender, ChannelMessage channelMessage) 
        {
            List<string> connectionIds = _connectionInformationManager.GetUsersConnectionInfo(new List<User>{sender});
            string groupName = $"{channel.Id}-{channel.Name}";

            await _chatHubContext.Clients.GroupExcept(groupName, connectionIds).SendAsync("ReceiveGroupMessage", new ChannelMessageDto(channelMessage));
        }

        public async Task NotifyUserPrivateMessageRemoved(PrivateMessage privateMessage) 
        {
            List<ConnectionInformation> receiverConnectionInformation = privateMessage.Receiver.ConnectionInformations.ToList(); 
            List<string> connectionIds = receiverConnectionInformation.Select(ci => ci.ConnectionId).ToList();

            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("PrivateMessageRemoved", new PrivateMessageDto(privateMessage));
        }

        public async Task NotifyUserPrivateMessageUpdated(PrivateMessage editedMessage) 
        {
            List<ConnectionInformation> receiverConnectionInformation = editedMessage.Receiver.ConnectionInformations.ToList(); 
            List<string> connectionIds = receiverConnectionInformation.Select(ci => ci.ConnectionId).ToList();

            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("PrivateMessageUpdated", new PrivateMessageDto(editedMessage));
        }

        public async Task NotifyError(string connectionId, string error) 
        {
            await _chatHubContext.Clients.Client(connectionId).SendAsync("Error", new Error(error));
        }

        public async Task NotifyUserNewContactAdded(string[] connectionIds, ContactedUserInfo contactedUserInfo) 
        {
            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("NewUserContactAdded", new ContactedUserInfoDto(contactedUserInfo));
        }

        public async Task NotifyUserPrivateMessageReceived(string[] connectionIds, PrivateMessage privateMessage) 
        {
            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("ReceiveMessage", new PrivateMessageDto(privateMessage));
        }

        public async Task NotifyUserMessageSent(string connectionId, PrivateMessage privateMessage) 
        {
            await _chatHubContext.Clients.Client(connectionId).SendAsync("MessageSent", new PrivateMessageDto(privateMessage));
        }

        public async Task NotifyUserChannelMessageSent(string connectionId, ChannelMessage channelMessage) 
        {
            await _chatHubContext.Clients.Client(connectionId).SendAsync("GroupMessageSent", new ChannelMessageDto(channelMessage));

        }
    }
}