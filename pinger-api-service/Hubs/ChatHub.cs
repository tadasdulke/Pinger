using Microsoft.AspNetCore.Authorization;
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
        private IContactedUsersManager _contactedUserManager;
        private IChannelMessageManager _channelMessageManager;
        private IConnectionInformationManager _connectionInformationManager;
        private IChatHubConnectionManager _chatHubConnectionManager;


        public ChatHub(
            ApplicationDbContext dbContext,
            ApplicationUserManager userManager,
            IChatSpaceManager chatSpaceManager,
            IPrivateMessagesManager privateMessageManager,
            IChannelMessageManager channelMessageManager,
            IChatHubConnectionManager chatHubConnectionManager,
            IConnectionInformationManager connectionInformationManager,
            IContactedUsersManager contactedUserManager
        )
        {
        _userManager = userManager;
            _dbContext = dbContext;
            _chatSpaceManager = chatSpaceManager;
            _privateMessageManager = privateMessageManager;
            _channelMessageManager = channelMessageManager;
            _chatHubConnectionManager = chatHubConnectionManager;
            _connectionInformationManager = connectionInformationManager;
            _contactedUserManager = contactedUserManager;
        }

        private async Task AddUserToGroups(List<Channel> channels) {

            foreach(Channel channel in channels) {
                string groupName = $"{channel.Id}-{channel.Name}";
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            }
        }

        public override async Task OnConnectedAsync()
        {
            string userId = _userManager.GetUserId(Context.User);
            int chatSpaceId = _userManager.GetChatSpaceId(Context.User);

            ChatSpace? currentChatSpace = await _chatSpaceManager.GetChatSpaceById(chatSpaceId);

            if(currentChatSpace is null) {
                await _chatHubConnectionManager.NotifyError(Context.ConnectionId, "Chatspace not found");
            }

            User? user = await _userManager.GetUserAsync(userId);

            if(user is null) {
                await _chatHubConnectionManager.NotifyError(Context.ConnectionId, "User not found");
            }
            
            List<Channel> activeChannels = user.Channels.Where(c => c.ChatSpace.Id == chatSpaceId).ToList();

            await AddUserToGroups(activeChannels);

            await _connectionInformationManager.AddConnectionInformation(Context.ConnectionId, currentChatSpace, user);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception) 
        {
            string userId = _userManager.GetUserId(Context.User);
            User? user = await _userManager.GetUserAsync(userId);

            if(user is null) {
                await _chatHubConnectionManager.NotifyError(Context.ConnectionId, "User not found");
                await base.OnDisconnectedAsync(exception);
            }

            ConnectionInformation? connectionInfoToRemove = user.ConnectionInformations.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);
            
            if(connectionInfoToRemove is not null) 
            {
                await _connectionInformationManager.RemoveConnectionInformation(connectionInfoToRemove);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendPrivateMessage(string receiverId, string message, int[] fileIds)
        {
            int chatspaceId = _userManager.GetChatSpaceId(Context.User);
            string senderId = _userManager.GetUserId(Context.User);

            PrivateMessage sentMessage = await _privateMessageManager.AddPrivateMessage(senderId, receiverId, chatspaceId, message, fileIds);

            List<ContactedUserInfo>? contactedUserInfos = await _contactedUserManager.GetContactedUsers(receiverId, chatspaceId);

            if(contactedUserInfos is null) {
                await _chatHubConnectionManager.NotifyError(Context.ConnectionId, "User not found");
                return;
            }

            bool alreadyContacted = contactedUserInfos.Any(cu => cu.ContactedUser.Id == senderId);
            
            List<ConnectionInformation> receiverConnectionInformations = await _connectionInformationManager.GetUserConnectionInfo(receiverId, chatspaceId);
            string[] receiverConnectionIds = receiverConnectionInformations.Select(rci => rci.ConnectionId).ToArray();
            
            if(!alreadyContacted) {
                ContactedUserInfo contactedUserInfo = await _contactedUserManager.AddContactedUser(receiverId, senderId, chatspaceId);
                await _chatHubConnectionManager.NotifyUserNewContactAdded(receiverConnectionIds, contactedUserInfo);
            }

            await _chatHubConnectionManager.NotifyUserMessageSent(Context.ConnectionId, sentMessage);
            await _chatHubConnectionManager.NotifyUserPrivateMessageReceived(receiverConnectionIds, sentMessage);
        }

        public async Task SendGroupMessage(int channelId, string message, int[] fileIds)
        {
            string senderId = _userManager.GetUserId(Context.User);
            Channel? channel = await _dbContext.Channel.FirstOrDefaultAsync(c => c.Id == channelId);

            if(channel is null) {
                await _chatHubConnectionManager.NotifyError(Context.ConnectionId, "Channel not found");
                return;
            }

            ChannelMessage sentMessage = await _channelMessageManager.AddChannelMessage(
                senderId,
                channelId,
                DateTime.Now,
                message,
                fileIds
            );

            User? sender = await _userManager.GetUserAsync(senderId);

            if(sender is null) {
                await _chatHubConnectionManager.NotifyError(Context.ConnectionId, "Sender not found");
                return;
            }

            await _chatHubConnectionManager.NotifyUserChannelMessageSent(Context.ConnectionId, sentMessage);
            await _chatHubConnectionManager.NotifyChannelReceivedMessage(channel, sender, sentMessage);
        }

        public async Task Ping() {
            await Clients.Client(Context.ConnectionId).SendAsync("Pong");   
        }
    }
} 