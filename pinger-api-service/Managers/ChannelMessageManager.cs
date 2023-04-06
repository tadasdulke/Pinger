using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public class ChannelMessageManager : IChannelMessageManager
    {
        private readonly IChannelMessageFileManager _channelMessageFileManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;

        public ChannelMessageManager(ApplicationDbContext dbContext, ApplicationUserManager userManager, IChannelMessageFileManager channelMessageFileManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _channelMessageFileManager = channelMessageFileManager;
        }

        public async Task<ChannelMessage> AddChannelMessage(
            string senderId, 
            int channelId, 
            DateTime sentAt, 
            string body,
            int[] fileIds
        )
        {
            User sender = await _dbContext.Users.Include(u => u.ProfileImageFile).Where(u => u.Id == senderId).FirstOrDefaultAsync();
            Channel? channel = _dbContext.Channel.Include(channel => channel.Messages).FirstOrDefault(channel => channel.Id == channelId);

            if(sender is null || channel is null) {
                return null;
            }

            List<ChannelMessageFile> channelMessageFiles = await _dbContext.ChannelMessageFile
                .Include(pmf => pmf.Owner)
                .Where(pmf => pmf.Owner.Id == senderId)
                .Where(pmf => fileIds.Contains(pmf.Id))
                .ToListAsync();
            

            ChannelMessage channelMessage = new ChannelMessage {
                Sender = sender,
                SentAt = sentAt,
                Body = body,
                ChannelMessageFiles = channelMessageFiles
            };

            channel.Messages.Add(channelMessage);
            _dbContext.SaveChanges();

            return channelMessage;
        }

        public async Task RemoveChannelMessage(List<ChannelMessage> channelMessagesToRemove) {
            List<ChannelMessageFile> channelMessageFiles = channelMessagesToRemove.Aggregate(
                new List<ChannelMessageFile>(),
                (acc, message) => acc.Concat(message.ChannelMessageFiles).ToList()
            );

            if(channelMessageFiles.Count > 0) {
                await _channelMessageFileManager.RemoveChannelFiles(channelMessageFiles);
            }

            _dbContext.ChannelMessage.RemoveRange(channelMessagesToRemove);
            await _dbContext.SaveChangesAsync();   
        }

        public async Task<List<ChannelMessage>> GetChannelMessagesAfterTime(DateTime? lastReadTime, int channelId) {
            List<ChannelMessage> messages = await _dbContext.ChannelMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(cm => cm.Channel)
                .Include(cm => cm.Sender)
                .ThenInclude(sender => sender.ProfileImageFile)
                .Include(cm => cm.ChannelMessageFiles)
                .Where(cm => cm.Channel.Id == channelId)
                .Where(pm => pm.SentAt > lastReadTime)
                .Reverse()
                .ToListAsync();
            
            return messages;
        }

        public async Task<List<ChannelMessage>> GetChannelMessagesBeforeTime(DateTime? lastReadTime, int channelId, int offset, int skip, int step) {
           List<ChannelMessage> messages = await _dbContext.ChannelMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(cm => cm.Channel)
                .Include(cm => cm.Sender)
                .ThenInclude(sender => sender.ProfileImageFile)
                .Include(cm => cm.ChannelMessageFiles)
                .Where(cm => cm.Channel.Id == channelId)
                .Where(pm => pm.SentAt <= lastReadTime)
                .Skip(offset + skip)
                .Take(step + 1)
                .Reverse()
                .ToListAsync();
            
            return messages;
        }

        public async Task<ChannelMessage?> GetChannelMessageAsync(long messageId, string userId) {
           ChannelMessage? channelMessage = await _dbContext.ChannelMessage
                .Include(pm => pm.Sender)
                .ThenInclude(s => s.ConnectionInformations)
                .Include(pm => pm.Sender)
                .ThenInclude(s => s.ProfileImageFile)
                .Include(pm => pm.Channel)
                .Include(pm => pm.ChannelMessageFiles)
                .Where(pm => pm.Sender.Id == userId)
                .Where(pm => pm.Id == messageId)
                .FirstOrDefaultAsync();
            
            return channelMessage;
        }

        public async Task UpdateChannelMessageAsync(ChannelMessage channelMessage, string body) {
            ChannelMessage channelMessageCopy = channelMessage;

            channelMessageCopy.Body = body;
            channelMessageCopy.Edited = true;
            _dbContext.ChannelMessage.Update(channelMessageCopy);
            await _dbContext.SaveChangesAsync();
        }
    }
}