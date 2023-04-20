using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/contacted-users")]
    [ApiController]
    public class ContactedUsersController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IContactedUsersManager _contactedUsersManager;
        private IChatSpaceManager _chatSpaceManager;
        private readonly ApplicationUserManager _userManager;
        private readonly IHubContext<ChatHub> _hubContext;

        public ContactedUsersController(
            ApplicationDbContext dbContext, 
            ApplicationUserManager userManager, 
            IChatSpaceManager chatSpaceManager,
            IHubContext<ChatHub>  hubContext,
            IContactedUsersManager contactedUsersManager
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
            _hubContext = hubContext;
            _contactedUsersManager = contactedUsersManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ContactedUserInfoDto>>> GetContactedUsers()
        {
            string userId = _userManager.GetUserId(User);
            int chatspaceId = _userManager.GetChatSpaceId(User);
            
            List<ContactedUserInfo>? contactedUserInfos = await _contactedUsersManager.GetContactedUsers(userId, chatspaceId);

            if(contactedUserInfos is null) {
                return NotFound(new Error("Contacted users not found"));
            }


            return contactedUserInfos.Select(cu => new ContactedUserInfoDto(cu)).ToList();
        }

        [Authorize]
        [HttpGet]
        [Route("{contactedUserId}")]
        public async Task<ActionResult<ContactedUserInfoDto>> GetContactedUser([FromRoute] string contactedUserId)
        {
            string ownerId = _userManager.GetUserId(User);
            int chatspaceId = _userManager.GetChatSpaceId(User);
            
            ContactedUserInfo? contactedUserInfo = await _contactedUsersManager.GetContactedUserAsync(contactedUserId, chatspaceId, ownerId);

            if(contactedUserInfo is null) {
                return NotFound(new Error("Contacted user not found"));
            }

            List<User>? chatSpaceMembers = await _chatSpaceManager.GetChatSpaceMembers(chatspaceId);

            if(chatSpaceMembers is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            bool contactedUserExistsInChatSpace = chatSpaceMembers.Any(m => m.Id == contactedUserId);

            return new ContactedUserInfoDto(contactedUserInfo, contactedUserExistsInChatSpace);
        }

        [Authorize]
        [HttpPut]
        [Route("{contactedUserId}/readtime")]
        public async Task<IActionResult> UpdateContactedUserReadTime([FromRoute] string contactedUserId)
        {
            string ownerId = _userManager.GetUserId(User);
            
            ContactedUserInfo? contactedUserInfo = await _contactedUsersManager.GetContactedUserInfoAsync(ownerId, contactedUserId);
            
            if(contactedUserInfo is null) {
                return NotFound(new Error("Contacted user info not found"));
            }
            
            await _contactedUsersManager.UpdateContactedUser(contactedUserInfo, DateTime.Now);

            return NoContent();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddContactedUser([FromBody] AddContactedUser contactedUserRequest)
        {
            string userId = _userManager.GetUserId(User);

            User? user = await _dbContext.Users
                .Include(u => u.ConnectionInformations)
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(cuf => cuf.ContactedUser)
                .Include(u => u.ContactedUsersInfo)
                .ThenInclude(cuf => cuf.ChatSpace)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if(user is null) {
                return NotFound();
            }
            
            string contactedUserId = contactedUserRequest.contactedUserId;
            User? contactedUser = await _dbContext.Users.Include(u => u.ProfileImageFile).FirstOrDefaultAsync(u => u.Id == contactedUserId);
            
            if(contactedUser is null) {
                return NotFound();
            }

            int chatspaceId = _userManager.GetChatSpaceId(User);
            List<ContactedUserInfo> contactedUserInfos = user.ContactedUsersInfo.Where(cui => cui.ChatSpace.Id == chatspaceId).ToList();

            bool userAlreadyAdded = contactedUserInfos.Any(item => item.ContactedUser.Id == contactedUserId); 
            if(userAlreadyAdded) {
                return NoContent();
            }

            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return NotFound();
            }

            ContactedUserInfo contactedUserInfo = new ContactedUserInfo();
            contactedUserInfo.ChatSpace = chatSpace;
            contactedUserInfo.ContactedUser = contactedUser;
            user.ContactedUsersInfo.Add(contactedUserInfo);
            await _userManager.UpdateAsync(user);

            List<string> connectionIds = user.ConnectionInformations.Select(ci => ci.ConnectionId).ToList();

            await _hubContext.Clients.Clients(connectionIds).SendAsync("NewUserContactAdded", new ContactedUserInfoDto(contactedUserInfo));
            return Ok();
        }
    }
} 