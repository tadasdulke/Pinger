using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public interface IConnectionInformationManager {
        public List<string> GetUsersConnectionInfo(List<User> users); 
        public Task AddConnectionInformation(string connectionId, ChatSpace chatSpace, User user);
        public Task RemoveConnectionInformation(ConnectionInformation connectionInformationToRemove);
        public Task<List<ConnectionInformation>> GetUserConnectionInfo(string userId, int chatSpaceId);

    }

    public class ConnectionInformationManager : IConnectionInformationManager
    {
        private ApplicationUserManager _userManager;
        private ApplicationDbContext _dbContext;

        public ConnectionInformationManager(ApplicationUserManager userManager, ApplicationDbContext dbContext) {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        public List<string> GetUsersConnectionInfo(List<User> users) 
        {
            return users.Aggregate(
                new List<string>(),
                (acc, member) => acc.Concat(member.ConnectionInformations.Select(ci => ci.ConnectionId)).ToList()
            );
        }

        public async Task<List<ConnectionInformation>> GetUserConnectionInfo(string userId, int chatSpaceId)
        {
            return await _dbContext.ConnectionInformations
                .Include(ci => ci.ChatSpace)
                .Where(ci => ci.ChatSpace.Id == chatSpaceId)
                .Where(ci => ci.UserId == userId)
                .ToListAsync();
        }

        public async Task AddConnectionInformation(string connectionId, ChatSpace chatSpace, User user) 
        {
            ConnectionInformation ct = new ConnectionInformation();
            ct.ConnectionId = connectionId;
            ct.ChatSpace = chatSpace;
            user.ConnectionInformations.Add(ct);

            await _userManager.UpdateAsync(user);
        }

        public async Task RemoveConnectionInformation(ConnectionInformation connectionInformationToRemove) 
        {
            _dbContext.ConnectionInformations.Remove(connectionInformationToRemove);
            await _dbContext.SaveChangesAsync();
        }
    }
}