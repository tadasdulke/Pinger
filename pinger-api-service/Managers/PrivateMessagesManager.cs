using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public class PrivateMessagesManager : IPrivateMessagesManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _applicationUserManager;
        private readonly IChatSpaceManager _chatSpaceManager;

        public PrivateMessagesManager(
            ApplicationDbContext dbContext, 
            ApplicationUserManager applicationUserManager,
            IChatSpaceManager chatSpaceManager
        )
        {
            _dbContext = dbContext;
            _applicationUserManager = applicationUserManager;
            _chatSpaceManager = chatSpaceManager;
        }

        public async Task<PrivateMessage> AddPrivateMessage(string senderId, string receiverId, int chatspaceId, string body)
        {
            User sender = await _applicationUserManager.FindByIdAsync(senderId);
            User receiver = await _applicationUserManager.FindByIdAsync(receiverId);
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatspaceId);

            if(chatSpace is null) {
                return null;
            }

            PrivateMessage privateMessage = new PrivateMessage();
            privateMessage.Receiver = receiver;
            privateMessage.Sender = sender;
            privateMessage.ChatSpace = chatSpace;
            privateMessage.SentAt = DateTime.Now;
            privateMessage.Body = body;

            await _dbContext.PrivateMessage.AddAsync(privateMessage);
            await _dbContext.SaveChangesAsync();

            return privateMessage;
        }

        public List<PrivateMessage> GetPrivateMessages(string senderId, string receiverId, int chatspaceId)
        {
            return _dbContext.PrivateMessage
                .Include(pm => pm.Receiver)
                .Include(pm => pm.Sender)
                .Include(pm => pm.ChatSpace)
                .Where(pm => (pm.Receiver.Id == receiverId) || (pm.Receiver.Id == senderId))
                .Where(pm => (pm.Sender.Id == senderId) || (pm.Sender.Id == receiverId))
                .Where(pm => pm.ChatSpace.Id == chatspaceId)
                .ToList();
        }
    }
}