using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public interface IChannelMessageFileManager 
    {
        public Task RemoveChannelFiles(List<ChannelMessageFile> channelMessageFiles);
    }

    public class ChannelMessageFileManager : IChannelMessageFileManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;

        public ChannelMessageFileManager(ApplicationDbContext dbContext, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task RemoveChannelFiles(List<ChannelMessageFile> channelMessageFiles) 
        {
            _dbContext.ChannelMessageFile.RemoveRange(channelMessageFiles);
            await _dbContext.SaveChangesAsync();
        }
    }
}