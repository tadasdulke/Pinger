using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public interface IContactedUsersManager {
        public Task<List<ContactedUserInfo>?> GetContactedUsers(string userId, int chatSpaceId);
        public Task<ContactedUserInfo?> GetContactedUserInfoAsync(string ownerId, string contactedUserId);
        public Task<ContactedUserInfo> AddContactedUser(string ownerId, string contactedUserId, int chatSpaceId);
        public Task UpdateContactedUser(ContactedUserInfo contactedUserInfo, DateTime lastReadTime);
        public Task<ContactedUserInfo?> GetContactedUserAsync(string contactedUserId, int chatspaceId, string ownerId);
    }

    public class ContactedUsersManager : IContactedUsersManager
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _applicationUserManager;
        private readonly IChatSpaceManager _chatSpaceManager;
 
        public ContactedUsersManager(ApplicationDbContext dbContext, ApplicationUserManager applicationUserManager, IChatSpaceManager chatSpaceManager)
        {
            _dbContext = dbContext;
            _applicationUserManager = applicationUserManager;
            _chatSpaceManager = chatSpaceManager;
        }

        public async Task<ContactedUserInfo?> GetContactedUserInfoAsync(string ownerId, string contactedUserId) {
            ContactedUserInfo? contactedUserInfo = await _dbContext.ContactedUserInfo
                .Include(cui => cui.Owner)
                .Include(cui => cui.ContactedUser)
                .Where(cui => cui.Owner.Id == ownerId)
                .FirstOrDefaultAsync(cui => cui.ContactedUser.Id == contactedUserId);

            if(contactedUserInfo is null) {
                return null;
            }

            return contactedUserInfo;
        }

        public async Task UpdateContactedUser(ContactedUserInfo contactedUserInfo, DateTime lastReadTime) {
            ContactedUserInfo contactedUserInfoCopy = contactedUserInfo;
            contactedUserInfoCopy.LastReadTime = lastReadTime;

            _dbContext.Update(contactedUserInfoCopy);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<ContactedUserInfo> AddContactedUser(string ownerId, string contactedUserId, int chatSpaceId) {
            User owner = await _applicationUserManager.FindByIdAsync(ownerId);
            User contactedUser = await _applicationUserManager.FindByIdAsync(contactedUserId);
            ChatSpace chatSpace = await _chatSpaceManager.GetChatSpaceById(chatSpaceId);


            ContactedUserInfo contactedUserInfo = new ContactedUserInfo {
                Owner = owner,
                ContactedUser = contactedUser,
                ChatSpace = chatSpace
            };


            await _dbContext.ContactedUserInfo.AddAsync(contactedUserInfo);
            await _dbContext.SaveChangesAsync();

            return contactedUserInfo;
        }
        
        public async Task<ContactedUserInfo?> GetContactedUserAsync(string contactedUserId, int chatspaceId, string ownerId) 
        {
            return await _dbContext.ContactedUserInfo
                .Include(cui => cui.Owner)
                .Include(cui => cui.ContactedUser)
                .ThenInclude(cu => cu.ProfileImageFile)
                .Include(cui => cui.ChatSpace)
                .Where(cui => cui.ChatSpace.Id == chatspaceId)
                .Where(cui => cui.Owner.Id == ownerId)
                .FirstOrDefaultAsync(cui => cui.ContactedUser.Id == contactedUserId);
        }

        public async Task<List<ContactedUserInfo>?> GetContactedUsers(string userId, int chatSpaceId)
        {
             User? user = await _dbContext.Users
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(userInfo => userInfo.ChatSpace)
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(userInfo => userInfo.ContactedUser)
                .ThenInclude(u => u.ProfileImageFile)
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(userInfo => userInfo.ChatSpace)
                .FirstOrDefaultAsync(u => u.Id == userId);


            if(user is null) {
                return null;
            }
            
            if(user.ContactedUsersInfo is not null) {
                return user.ContactedUsersInfo.Where(cui => cui.ChatSpace.Id == chatSpaceId).ToList();
            }

            return null;
        }
    }

}