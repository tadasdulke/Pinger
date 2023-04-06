
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
namespace pinger_api_service
{
    public class ApplicationUserManager : UserManager<User>
    {
        private ApplicationDbContext _dbContext { get; set; }
        public ApplicationUserManager(
            IUserStore<User> store,
            IOptions<IdentityOptions> optionsAccessor,
            IPasswordHasher<User> passwordHasher,
            IEnumerable<IUserValidator<User>> userValidators,
            IEnumerable<IPasswordValidator<User>> passwordValidators,
            ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors,
            IServiceProvider services,
            ILogger<UserManager<User>> logger,
            ApplicationDbContext dbContext
        )
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
            _dbContext = dbContext;
        }

        public int GetChatSpaceId(ClaimsPrincipal principal) {
            return int.Parse(principal.FindFirstValue(CustomClaims.ChatSpaceId));
        }

        public async Task<File?> GetProfilePictureAsync(string userId) {
            User? user = await GetUserAsync(userId);
        
            if(user is null || user.ProfileImageFile is null) {
                return null;
            }

            return user.ProfileImageFile;            
        }

        public async Task<User?> GetUserAsync(string userId) {
            return await _dbContext.Users
                .Include(u => u.ConnectionInformations)
                .Include(u => u.ProfileImageFile)
                .Include(u => u.Channels)
                .ThenInclude(u => u.ChatSpace)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<List<User>> GetUsersAsync(string[] userId) {
            return await _dbContext.Users
                .Include(u => u.ConnectionInformations)
                .Include(u => u.ProfileImageFile)
                .Where(u => userId.Contains(u.Id))
                .ToListAsync();
        }
    }
}