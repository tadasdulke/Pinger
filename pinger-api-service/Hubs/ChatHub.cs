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
        private IChannelMessageManager _channelMessageManager;

        public ChatHub(
            ApplicationDbContext dbContext,
            ApplicationUserManager userManager,
            IChatSpaceManager chatSpaceManager,
            IPrivateMessagesManager privateMessageManager,
            IChannelMessageManager channelMessageManager
        )
        {
        _userManager = userManager;
            _dbContext = dbContext;
            _chatSpaceManager = chatSpaceManager;
            _privateMessageManager = privateMessageManager;
            _channelMessageManager = channelMessageManager;
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

            ChatSpace currentChatSpace = _chatSpaceManager.GetChatSpaceById(chatSpaceId);
            User? user = await _dbContext.Users
                .Include(u => u.Channels)
                .ThenInclude(c => c.ChatSpace)
                .FirstOrDefaultAsync(u => u.Id == userId);
            
            List<Channel> activeChannels = user.Channels.Where(c => c.ChatSpace.Id == chatSpaceId).ToList();
            
            await AddUserToGroups(activeChannels);

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
            
            User? receiver = await _dbContext.Users
                .Include(u => u.ConnectionInformations)
                .ThenInclude(ci => ci.ChatSpace)
                .FirstOrDefaultAsync(u => u.Id == receiverId);
            List<ConnectionInformation> filteredConnectionInformations = receiver.ConnectionInformations.Where(ci => ci.ChatSpace.Id == chatspaceId).ToList();

            var sentMessage = await _privateMessageManager.AddPrivateMessage(senderId, receiverId, chatspaceId, message);

            // Add contacted user for receiver if not added
            
            List<ContactedUserInfo> contactedUserInfos = await _dbContext.ContactedUserInfo
                .Include(cui => cui.ChatSpace)
                .Include(cui => cui.ContactedUser)
                .Include(cui => cui.Owner)
                .Where(cui => cui.Owner.Id == receiverId)
                .ToListAsync();
            bool alreadyContacted = contactedUserInfos.Any(cu => cu.ContactedUser.Id == senderId);
            
            if(!alreadyContacted) {
                User sender = await _userManager.FindByIdAsync(senderId);
                ChatSpace chatSpace = _chatSpaceManager.GetChatSpaceById(chatspaceId);

                ContactedUserInfo contactedUserInfo = new ContactedUserInfo {
                    Owner = receiver,
                    ContactedUser = sender,
                    ChatSpace = chatSpace
                };


                var contactedUserInfoToSend = new {
                    ContactedUser = new {
                        Id = sender.Id,
                        userName = sender.UserName
                    }
                };

                await SendToMulitpleClients(filteredConnectionInformations, "NewUserContactAdded", contactedUserInfoToSend);
                _dbContext.ContactedUserInfo.Add(contactedUserInfo);
                await _dbContext.SaveChangesAsync();
            }

            var sentMessageObj = new {
                Id = sentMessage.Id,
                Receiver = new {
                    Id = sentMessage.Receiver.Id,
                    UserName = sentMessage.Receiver.UserName,
                },
                Sender = new {
                    Id = sentMessage.Sender.Id,
                    UserName = sentMessage.Sender.UserName
                },
                SentAt = sentMessage.SentAt,
                Body = sentMessage.Body,
                Edited = sentMessage.Edited,
            };

            await Clients.Client(Context.ConnectionId).SendAsync("MessageSent", sentMessageObj);
            await SendToMulitpleClients(filteredConnectionInformations, "ReceiveMessage", sentMessageObj);
        }

        private async Task SendToMulitpleClients(List<ConnectionInformation> connectionInformation, string method, object message) 
        {
            foreach(ConnectionInformation connectionInfo in connectionInformation) {
                await Clients.Client(connectionInfo.ConnectionId).SendAsync(method, message);   
            }
        }

        public async Task Ping() {
            await Clients.Client(Context.ConnectionId).SendAsync("Pong");
        }

        public async Task SendGroupMessage(int channelId, string message)
        {
            string senderId = _userManager.GetUserId(Context.User);
            Channel channel = _dbContext.Channel.FirstOrDefault(c => c.Id == channelId);

            string groupName = $"{channel.Id}-{channel.Name}";

            if(channel is null) {
                return;
            }

            ChannelMessage sentMessage = await _channelMessageManager.AddChannelMessage(
                senderId,
                channelId,
                DateTime.Now,
                message
            );

            User? sender = await _dbContext.Users
                .Include(u => u.ConnectionInformations)
                .Where(u => u.Id == senderId)
                .FirstOrDefaultAsync();

            List<string> senderConnectionIds = sender.ConnectionInformations.Select(ci => ci.ConnectionId).ToList();

            var sentMessageDto = new {
                Id = sentMessage.Id,
                Sender = new {
                    Id = sentMessage.Sender.Id,
                    UserName = sentMessage.Sender.UserName
                },
                ChannelId = sentMessage.Channel.Id,
                SentAt = sentMessage.SentAt,
                Body = sentMessage.Body
            };

            await Clients.Client(Context.ConnectionId).SendAsync("GroupMessageSent", sentMessageDto);
            await Clients.GroupExcept(groupName, senderConnectionIds).SendAsync("ReceiveGroupMessage", sentMessageDto);
        }
    }
} 