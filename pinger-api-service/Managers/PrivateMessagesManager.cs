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

        public async Task<PrivateMessage> AddPrivateMessage(
            string senderId, 
            string receiverId, 
            int chatspaceId, 
            string body,
            int[] fileIds
        )
        {
            User sender = await _dbContext.Users.Include(u => u.ProfileImageFile).Where(u => u.Id == senderId).FirstOrDefaultAsync();
            User receiver = await _dbContext.Users.Where(u => u.Id == receiverId).FirstOrDefaultAsync();
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatspaceId);

            if(chatSpace is null) {
                return null;
            }

            List<PrivateMessageFile> privateMessageFiles = await _dbContext.PrivateMessageFile
                .Include(pmf => pmf.Owner)
                .Include(pmf => pmf.Receiver)
                .Where(pmf => pmf.Owner.Id == senderId)
                .Where(pmf => fileIds.Contains(pmf.Id))
                .ToListAsync();

            PrivateMessage privateMessage = new PrivateMessage();
            privateMessage.Receiver = receiver;
            privateMessage.Sender = sender;
            privateMessage.ChatSpace = chatSpace;
            privateMessage.SentAt = DateTime.Now;
            privateMessage.Body = body;
            privateMessage.PrivateMessageFiles = privateMessageFiles;

            await _dbContext.PrivateMessage.AddAsync(privateMessage);
            await _dbContext.SaveChangesAsync();

            return privateMessage;
        }

        public async Task<PrivateMessage?> RemovePrivateMessage(long messageId, string senderId)
        {
            PrivateMessage? privateMessageToRemove = _dbContext.PrivateMessage
                .Include(pm => pm.Sender)
                .Include(pm => pm.Receiver)
                .ThenInclude(receiver => receiver.ConnectionInformations)
                .Include(pm => pm.PrivateMessageFiles)
                .Where(pm => pm.Id == messageId)
                .Where(pm => pm.Sender.Id == senderId)
                .FirstOrDefault();

            if(privateMessageToRemove is null) {
                return null;
            }

            List<PrivateMessageFile> privateMessageFiles = privateMessageToRemove.PrivateMessageFiles.ToList();

            _dbContext.RemoveRange(privateMessageFiles);
            _dbContext.PrivateMessage.Remove(privateMessageToRemove);
            await _dbContext.SaveChangesAsync();
            return privateMessageToRemove;
        }
    }
}