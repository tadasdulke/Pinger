using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/contacted-users")]
    [ApiController]
    public class ContactedUsersController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IChatSpaceManager _chatSpaceManager;
        private readonly ApplicationUserManager _userManager;

        public ContactedUsersController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IChatSpaceManager chatSpaceManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ContactedUserInfoDto>>> GetContactedUsers()
        {
            string userId = _userManager.GetUserId(User);
            int chatspaceId = _userManager.GetChatSpaceId(User);
            User? user = await _dbContext.Users
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(userInfo => userInfo.ChatSpace)
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(userInfo => userInfo.ContactedUser)
                .ThenInclude(u => u.ProfileImageFile)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            if(user is null) {
                return NotFound();
            }
            
            List<ContactedUserInfo> contactedUsers = user.ContactedUsersInfo.Where(userInfo => userInfo.ChatSpace.Id == chatspaceId).ToList();

            return contactedUsers.Select(cu => new ContactedUserInfoDto(cu)).ToList();
        }

        [Authorize]
        [HttpPut]
        [Route("{contactedUserId}/readtime")]
        public async Task<IActionResult> UpdateContactedUserReadTime([FromRoute] string contactedUserId)
        {
            string ownerId = _userManager.GetUserId(User);
            ContactedUserInfo? contactedUserInfo = await _dbContext.ContactedUserInfo
                .Include(cui => cui.Owner)
                .Include(cui => cui.ContactedUser)
                .Where(cui => cui.Owner.Id == ownerId)
                .FirstOrDefaultAsync(cui => cui.ContactedUser.Id == contactedUserId);
            
            if(contactedUserInfo is null) {
                return NotFound();
            }
            
            contactedUserInfo.LastReadTime = DateTime.Now;
            
            _dbContext.Update(contactedUserInfo);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost]
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