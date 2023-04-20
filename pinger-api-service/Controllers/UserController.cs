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
        [HttpPut]
        public async Task<ActionResult<UserDto>> UpdateUser([FromForm] IFormFile? profileImage, [FromForm] string username)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.ProfileImageFile).Where(u => u.Id == userId).FirstOrDefaultAsync();

            if(user is null) {
                return NotFound();
            }

            user.UserName = username;

            if(profileImage is not null) {
                if(user.ProfileImageFile is not null) {
                    _fileManager.RemoveFile(user.ProfileImageFile.Path);
                }

                LocalFile profileFile = await _fileManager.AddFile(profileImage, "data/public", userId);
                user.ProfileImageFile = new File{
                    Name = profileFile.Name,
                    Path = profileFile.Path,
                    ContentType = profileFile.ContentType,
                };
            }
            
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return new UserDto(user);
        }

        [Authorize]
        [HttpGet]
        [Route("self")]
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
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            string userId = _userManager.GetUserId(User);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatSpaceId);

            if(chatSpace is null) {
                return NotFound(new Error("ChatSpace not found"));
            }

            if(chatSpace.Owner.Id != userId) {
                return Unauthorized(new Error("Action can only be done by chatspace owner"));
            }

            List<User> users = await _dbContext.Users.ToListAsync();

            return users.Select(u => new UserDto(u)).ToList();    
        }
    }
} 