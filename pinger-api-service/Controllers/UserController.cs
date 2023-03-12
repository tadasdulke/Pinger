using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        private readonly ApplicationUserManager _userManager;

        public UserController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IChatSpaceManager chatSpaceManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
        }

        [Authorize]
        [HttpGet]
        [Route("contacted-users")]
        public async Task<ActionResult<List<ContactedUserInfo>>> GetContactedUsers()
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

            return contactedUsers;

        }

        [Authorize]
        [HttpPost]
        [Route("contacted-users")]
        public async Task<IActionResult> AddContactedUser([FromBody] AddContactedUser contactedUserRequest)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.ContactedUsersInfo).FirstOrDefaultAsync(u => u.Id == userId);

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