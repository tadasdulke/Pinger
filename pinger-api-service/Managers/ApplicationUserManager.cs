
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;

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

        public File? GetProfilePicture(string userId) {
            User? user = _dbContext.Users.Include(u => u.ProfileImageFile).FirstOrDefault(u => u.Id == userId);
        
            if(user is null || user.ProfileImageFile is null) {
                return null;
            }

            return user.ProfileImageFile;            
        }
    }
}