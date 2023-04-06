using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public interface IChannelReadTimeManager 
    {
        public Task<List<ChannelReadTime>> GetChannelReadTimes(int channelId);
        public Task<ChannelReadTime> GetUsersChannelReadTime(User user, Channel channel); 
        public Task<ChannelReadTime> CreateUsersChannelReadTime(User user, Channel channel); 
        public Task<ChannelReadTime?> GetUsersChannelReadTimes(int channelId, string userId); 
        public Task<ChannelReadTime> UpdateUsersChannelReadTime(ChannelReadTime channelReadTime);

    }

    public class ChannelReadTimeManager : IChannelReadTimeManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;

        public ChannelReadTimeManager(ApplicationDbContext dbContext, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<List<ChannelReadTime>> GetChannelReadTimes(int channelId) 
        {
            List<ChannelReadTime> channelReadTimes = await _dbContext.ChannelReadTimes
                .Include(crt => crt.Channel)
                .Where(crt => crt.Channel.Id == channelId)
                .ToListAsync();

            return channelReadTimes;
        }

        public async Task<ChannelReadTime?> GetUsersChannelReadTimes(int channelId, string userId) 
        {
            ChannelReadTime? channelReadTime = await _dbContext.ChannelReadTimes
                .Include(crt => crt.Owner)
                .Where(crt => crt.Owner.Id == userId)
                .FirstOrDefaultAsync(crt => crt.Channel.Id == channelId);

            return channelReadTime;
        }

        public async Task<ChannelReadTime> GetUsersChannelReadTime(User user, Channel channel) 
        {
            ChannelReadTime? channelReadTime = await _dbContext.ChannelReadTimes
                .Include(crt => crt.Owner)
                .Include(crt => crt.Channel)
                .Where(crt => crt.Owner.Id == user.Id)
                .FirstOrDefaultAsync(crt => crt.Channel.Id == channel.Id);

            if(channelReadTime is null) {
                channelReadTime = await CreateUsersChannelReadTime(user, channel);
            }

            return channelReadTime;
        }

        public async Task<ChannelReadTime> CreateUsersChannelReadTime(User user, Channel channel) 
        {
            ChannelReadTime channelReadTime = new ChannelReadTime{
                    Owner = user,
                    LastReadTime = DateTime.Now,
                    Channel = channel,
            };
            _dbContext.ChannelReadTimes.Add(channelReadTime);
            await _dbContext.SaveChangesAsync();

            return channelReadTime;
        }

        public async Task<ChannelReadTime> UpdateUsersChannelReadTime(ChannelReadTime channelReadTime) 
        {
            ChannelReadTime channelReadTimeCopy = channelReadTime;

            channelReadTimeCopy.LastReadTime = DateTime.Now;
            _dbContext.ChannelReadTimes.Update(channelReadTimeCopy);
            await _dbContext.SaveChangesAsync();

            return channelReadTimeCopy;
        }
    }
}