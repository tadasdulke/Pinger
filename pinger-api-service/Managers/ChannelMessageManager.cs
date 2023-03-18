using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public class ChannelMessageManager : IChannelMessageManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;

        public ChannelMessageManager(ApplicationDbContext dbContext, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<ChannelMessage> AddChannelMessage(string senderId, int channelId, DateTime sentAt, string body)
        {
            User sender = await _userManager.FindByIdAsync(senderId);
            Channel? channel = _dbContext.Channel.Include(channel => channel.Messages).FirstOrDefault(channel => channel.Id == channelId);

            if(sender is null || channel is null) {
                return null;
            }

            ChannelMessage channelMessage = new ChannelMessage {
                Sender = sender,
                SentAt = sentAt,
                Body = body
            };

            channel.Messages.Add(channelMessage);
            _dbContext.SaveChanges();

            return channelMessage;
        }
    }
}