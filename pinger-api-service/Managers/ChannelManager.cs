using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public interface IChannelManager {
        public Task<Channel> CreateChannel(string name, bool isPrivate, User owner, ChatSpace chatSpace);
        public Task<Channel> UpdateChannel(Channel channel, string name);
        public Task<Channel?> GetChannelAsync(int channelId);
        public Task RemoveChannel(Channel channel);
        public Task AddUserToChannel(User user, Channel channel);
        public Task RemoveUserFromChannel(Channel channel, User user);
        public Task<Channel?> GetChannelByNameAsync(string name, int chatspace);

    }

    public class ChannelManager : IChannelManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;
        private readonly IChannelReadTimeManager _channelReadTimeManager;
        private readonly IChannelMessageManager _channelMessageManager;

        public ChannelManager(
            ApplicationDbContext dbContext, 
            ApplicationUserManager userManager, 
            IChannelReadTimeManager channelReadTimeManager,
            IChannelMessageManager channelMessageManager
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _channelReadTimeManager = channelReadTimeManager;
            _channelMessageManager = channelMessageManager;
        }

        public async Task<Channel> CreateChannel(string name, bool isPrivate, User owner, ChatSpace chatSpace) {
            Channel newChannel = new Channel {
                Name = name,
                Owner = owner,
                Private = isPrivate,
                Members = new List<User>{ owner },
                ChatSpace = chatSpace
            };

            await _dbContext.Channel.AddAsync(newChannel);
            await _dbContext.SaveChangesAsync();

            return newChannel;
        }

        public async Task<Channel> UpdateChannel(Channel channel, string name) {
            Channel channelCopy = channel;
            channelCopy.Name = name;
            _dbContext.Channel.Update(channelCopy);
            await _dbContext.SaveChangesAsync();

            return channelCopy;
        }

        public async Task<Channel?> GetChannelAsync(int channelId) {
            Channel? channel = await _dbContext.Channel
                .Include(c => c.Owner)
                .Include(c => c.Messages)
                .ThenInclude(m => m.ChannelMessageFiles)
                .Include(c => c.Members)
                .ThenInclude(m => m.ConnectionInformations)
                .Include(c => c.ChatSpace)
                .FirstOrDefaultAsync(c => c.Id == channelId);

            return channel;
        }

        public async Task<Channel?> GetChannelByNameAsync(string name, int chatspace) {
            Channel? channel = await _dbContext.Channel
                .Include(c => c.ChatSpace)
                .Where(c => c.ChatSpace.Id == chatspace)
                .FirstOrDefaultAsync(c => c.Name.Trim().ToLower() == name.Trim().ToLower());

            return channel;
        }

        public async Task AddUserToChannel(User user, Channel channel) {
            Channel channelCopy = channel;
            channelCopy.Members.Add(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task RemoveChannel(Channel channel) {
            List<ChannelReadTime> channelReadTimes = await _channelReadTimeManager.GetChannelReadTimes(channel.Id);
            _dbContext.ChannelReadTimes.RemoveRange(channelReadTimes);

            await _channelMessageManager.RemoveChannelMessage(channel.Messages.ToList());

            _dbContext.Channel.Remove(channel);
            await _dbContext.SaveChangesAsync();
        }

        public async Task RemoveUserFromChannel(Channel channel, User user) {
            Channel channelCopy = channel;
            channelCopy.Members.Remove(user);
            _dbContext.Channel.Update(channelCopy);
            await _dbContext.SaveChangesAsync();
        }
    }
}