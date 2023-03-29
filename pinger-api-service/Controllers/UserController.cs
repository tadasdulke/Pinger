using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IChatSpaceManager _chatSpaceManager;
        private IFileManager _fileManager;
        private readonly ApplicationUserManager _userManager;

        public UserController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IChatSpaceManager chatSpaceManager, IFileManager fileManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
            _fileManager = fileManager;
        }

        [Authorize]
        [HttpGet]
        [Route("contacted-users")] 
        public async Task<ActionResult<List<ContactedUserInfoDto>>> GetContactedUsers()
        {
            string userId = _userManager.GetUserId(User);
            int chatspaceId = _userManager.GetChatSpaceId(User);
            User? user = await _dbContext.Users
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(userInfo => userInfo.ChatSpace)
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(userInfo => userInfo.ContactedUser)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            if(user is null) {
                return NotFound();
            }
            
            List<ContactedUserInfo> contactedUsers = user.ContactedUsersInfo.Where(userInfo => userInfo.ChatSpace.Id == chatspaceId).ToList();

            return contactedUsers.Select(cu => new ContactedUserInfoDto(cu)).ToList();
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromForm] IFormFile? profileImage, [FromForm] string username)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.ProfileImageFile).Where(u => u.Id == userId).FirstOrDefaultAsync();

            if(user is null) {
                return NotFound();
            }

            user.UserName = username;

            if(user.ProfileImageFile is not null) {
                _fileManager.RemoveFile(user.ProfileImageFile.Path);
            }

            if(profileImage is not null) {
                LocalFile profileFile = await _fileManager.AddFile(profileImage, "data/public", userId);
                user.ProfileImageFile = new File{
                    Name = profileFile.Name,
                    Path = profileFile.Path,
                    ContentType = profileFile.ContentType,
                };
            }
            
            await _userManager.UpdateAsync(user);
            _dbContext.SaveChanges();

            return NoContent();
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUser()
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.ProfileImageFile).Where(u => u.Id == userId).FirstOrDefaultAsync();

            if(user is null) {
                return NotFound();
            }

            return new UserDto(user);    
        }

        [Authorize]
        [HttpPost]
        [Route("contacted-users")]
        public async Task<IActionResult> AddContactedUser([FromBody] AddContactedUser contactedUserRequest)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.ContactedUsersInfo).ThenInclude(cuf => cuf.ContactedUser).FirstOrDefaultAsync(u => u.Id == userId);

            if(user is null) {
                return NotFound();
            }
            
            string contactedUserId = contactedUserRequest.contactedUserId;
            User? contactedUser = await _userManager.FindByIdAsync(contactedUserId);
            
            if(contactedUser is null) {
                return NotFound();
            }
            
            bool userAlreadyAdded = user.ContactedUsersInfo.Any(item => item.ContactedUser.Id == contactedUserId); 
            if(userAlreadyAdded) {
                return NoContent();
            }

            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return NotFound();
            }

            ContactedUserInfo contactedUserInfo = new ContactedUserInfo();
            contactedUserInfo.ChatSpace = chatSpace;
            contactedUserInfo.ContactedUser = contactedUser;
            user.ContactedUsersInfo.Add(contactedUserInfo);
            await _userManager.UpdateAsync(user);
            return Ok();
        }
    }
} 