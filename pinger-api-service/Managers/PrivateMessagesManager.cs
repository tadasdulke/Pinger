using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public class PrivateMessagesManager : IPrivateMessagesManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _applicationUserManager;
        private readonly IChatSpaceManager _chatSpaceManager;
        private IFileManager _fileManager;
        

        public PrivateMessagesManager(
            ApplicationDbContext dbContext, 
            ApplicationUserManager applicationUserManager,
            IChatSpaceManager chatSpaceManager,
            IFileManager fileManager
        )
        {
            _dbContext = dbContext;
            _applicationUserManager = applicationUserManager;
            _chatSpaceManager = chatSpaceManager;
            _fileManager = fileManager;
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
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);

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

            foreach (PrivateMessageFile pmf in privateMessageToRemove.PrivateMessageFiles)
            {
                _fileManager.RemoveFile(pmf.Path);
            }
            
            return privateMessageToRemove;
        }

        public async Task<List<PrivateMessage>> GetPrivateMessagesAfterTime(string receiverId, string senderId, int chatSpaceId, DateTime? lastReadTime) 
        {
            return await _dbContext.PrivateMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(pm => pm.Receiver)
                .Include(pm => pm.Sender)
                .ThenInclude(sender => sender.ProfileImageFile)
                .Include(pm => pm.ChatSpace)
                .Include(pm => pm.PrivateMessageFiles)
                .Where(pm => (pm.Receiver.Id == receiverId) || (pm.Receiver.Id == senderId))
                .Where(pm => (pm.Sender.Id == senderId) || (pm.Sender.Id == receiverId))
                .Where(pm => pm.ChatSpace.Id == chatSpaceId)
                .Where(pm => pm.SentAt > lastReadTime)
                .Reverse()
                .ToListAsync();
        }

        public async Task<List<PrivateMessage>> GetPrivateMessagesBeforeTime(
            string receiverId, 
            string senderId, 
            int chatSpaceId, 
            DateTime? lastReadTime,
            int offset,
            int skip,
            int step
        ) 
        {
            DateTime? readTime = lastReadTime;
            if(lastReadTime is null) {
                readTime = DateTime.Now;
            }

            return await _dbContext.PrivateMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(pm => pm.Receiver)
                .Include(pm => pm.Sender)
                .ThenInclude(sender => sender.ProfileImageFile)
                .Include(pm => pm.ChatSpace)
                .Include(pm => pm.PrivateMessageFiles)
                .Where(pm => (pm.Receiver.Id == receiverId) || (pm.Receiver.Id == senderId))
                .Where(pm => (pm.Sender.Id == senderId) || (pm.Sender.Id == receiverId))
                .Where(pm => pm.ChatSpace.Id == chatSpaceId)
                .Where(pm => pm.SentAt <= readTime)
                .Skip(offset + skip)
                .Take(step + 1)
                .Reverse()
                .ToListAsync();
        }

        public async Task<PrivateMessage?> UpdatePrivateMessage(string senderId, long messageId, string body) 
        {
            PrivateMessage? messageToEdit = _dbContext.PrivateMessage
                .Include(pm => pm.Receiver)
                .ThenInclude(receiver => receiver.ConnectionInformations)
                .Include(pm => pm.Sender)
                .ThenInclude(s => s.ProfileImageFile)
                .Include(pm => pm.PrivateMessageFiles)
                .Where(pm => pm.Sender.Id == senderId)
                .Where(pm => pm.Id == messageId)
                .FirstOrDefault();

            if(messageToEdit is null) {
                return null;
            } 

            messageToEdit.Body = body;
            messageToEdit.Edited = true;
            _dbContext.PrivateMessage.Update(messageToEdit);
            await _dbContext.SaveChangesAsync();
            return messageToEdit;
        }
    }
}