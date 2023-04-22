using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatSpacesController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IChatSpaceManager _chatSpaceManager;
        private readonly ApplicationUserManager _userManager;
        private IChatHubConnectionManager _chatHubConnectionManager;
        
        public ChatSpacesController(
            ApplicationDbContext dbContext, 
            ApplicationUserManager userManager, 
            IChatSpaceManager chatSpaceManager,
            IChatHubConnectionManager chatHubConnectionManager
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
            _chatHubConnectionManager = chatHubConnectionManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ChatSpaceDto>>> GetChatPublicSpaces()
        {
            List<ChatSpace> chatSpaces = await _dbContext.ChatSpace.Where(c => c.Private == false).ToListAsync();
            return chatSpaces.Select(cs => new ChatSpaceDto(cs)).ToList();
        }

        [Authorize]
        [HttpGet]
        [Route("invited")]
        public async Task<ActionResult<List<ChatSpaceDto>>> GetInvitedChatSpaces()
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.InvitedChatSpaces).FirstOrDefaultAsync(u => u.Id == userId);
            
            if(user is null) {
                return BadRequest(new Error("User not found"));
            }

            return user.InvitedChatSpaces.Select(cs => new ChatSpaceDto(cs)).ToList();
        }

        [Authorize]
        [HttpGet]
        [Route("invited-users")]
        public async Task<ActionResult<List<UserDto>>> GetInvitedUsers()
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            string userId = _userManager.GetUserId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return BadRequest(new Error("Chatspace not found"));
            }

            return chatSpace.InvitedUsers.Select(u => new UserDto(u)).ToList();
        }

        [Authorize]
        [HttpPost]
        [Route("accept-invite/{chatSpaceId}")]
        public async Task<IActionResult> AcceptInvitation(int chatSpaceId)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.InvitedChatSpaces).FirstOrDefaultAsync(u => u.Id == userId);
            
            if(user is null) {
                return BadRequest(new Error("User not found"));
            }

            ChatSpace? invitedChatSpace = user.InvitedChatSpaces.FirstOrDefault(icp => icp.Id == chatSpaceId); 

            if(invitedChatSpace is null) {
                return BadRequest(new Error("User was not invited to this chatspace"));
            }

            user.ChatSpaces.Add(invitedChatSpace);
            user.InvitedChatSpaces.Remove(invitedChatSpace);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateChatSpace([FromBody] NewChatSpace newChatSpace)
        {
            string ownerId = _userManager.GetUserId(User);
            User owner = await _userManager.FindByIdAsync(ownerId);
            ChatSpace chatSpace = new ChatSpace();
            chatSpace.Name = newChatSpace.Name.Trim();
            chatSpace.Private = newChatSpace.Private;
            chatSpace.Owner = owner;

            bool chatSpaceAlreadyExists = _dbContext.ChatSpace.Any(chatSpace => chatSpace.Name.ToLower() == newChatSpace.Name.Trim().ToLower());

            if(chatSpaceAlreadyExists) {
                return BadRequest(new Error("Chatspace already exists"));
            }

            chatSpace.Members.Add(owner);

            _dbContext.ChatSpace.Add(chatSpace);
            await _dbContext.SaveChangesAsync();
            
            return NoContent();
        }

        [Authorize]
        [HttpGet("{chatspaceId}")]
        public async Task<ActionResult<ChatSpaceDto>> GetChatSpaceById([FromRoute] int chatspaceId)
        {
            string userId = _userManager.GetUserId(User);
            ChatSpace? chatspace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatspace is null) {
                return NotFound(new Error("Chatspace does not exist"));
            }

            bool isUserInMembers = chatspace.Members.Any(m => m.Id == userId);

            if(!isUserInMembers) {
                return BadRequest(new Error("User does not exists in chatspace"));
            }

            return new ChatSpaceDto(chatspace);
        }

        [Authorize]
        [HttpPost("{chatspaceId}/join")]
        public async Task<IActionResult> JoinChatSpace([FromRoute] int chatspaceId)
        {
            string userId = _userManager.GetUserId(User);
            User user = await _userManager.FindByIdAsync(userId);
            ChatSpace? chatspace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatspace is null) {
                return NotFound("Chatspace not found");
            }

            await _chatSpaceManager.AddUserToChatspace(chatspace, user);

            return NoContent();

        }

        [Authorize]
        [HttpGet("joined")]
        public async Task<ActionResult<List<ChatSpaceDto>>> GetUsersChatSpaces()
        {
            string userId = _userManager.GetUserId(User);
            List<ChatSpace> chatSpaces = await _chatSpaceManager.GetUsersChatSpaces(userId);

            return chatSpaces.Select(x => new ChatSpaceDto(x)).ToList();
        }

        [Authorize]
        [HttpGet("members")]
        public async Task<ActionResult<List<UserDto>>> GetChatSpaceMembers([FromQuery(Name = "search")]  string? search)
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            List<User> members = chatSpace.Members.ToList();

            if(search is null) {
                return members.Select(x => new UserDto(x)).ToList(); 
            }

            List<User> filteredMembers = members.Where(m => m.UserName.ToLower().Contains(search.ToLower())).ToList();

            
            return filteredMembers.Select(x => new UserDto(x)).ToList();
        }

        [Authorize]
        [HttpGet("members/{memberId}")]
        public async Task<ActionResult<UserDto>> GetChatSpaceMember([FromRoute] string memberId)
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            
            User? foundMember = chatSpace.Members.FirstOrDefault(m => m.Id == memberId);

            if(foundMember is null) {
                return NotFound(new Error("Member does not exist"));
            }

            return new UserDto(foundMember);
        }
        [Authorize]
        [HttpPost("members/{memberId}")]
        public async Task<IActionResult> InviteUserToChatSpace([FromRoute] string memberId)
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            string ownerId = _userManager.GetUserId(User);
            if(chatSpace.Owner.Id != ownerId) {
                return Unauthorized(new Error("Users can only be invited by chatspace owner"));
            }

            User? userToAdd = await _userManager.FindByIdAsync(memberId);

            if(userToAdd is null) {
                return NotFound(new Error("User does not exist"));
            }

            userToAdd.InvitedChatSpaces.Add(chatSpace);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("members/{memberId}")]
        public async Task<ActionResult<UserDto>> RemoveMemberFromChatSpace([FromRoute] string memberId)
        {
            string ownerId = _userManager.GetUserId(User);
            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            if(chatSpace.Owner.Id != ownerId) {
                return NotFound(new Error("Only owner of the chatspace can remove users"));
            }

            if(ownerId == memberId) {
                return NotFound(new Error("Chatspace owner can't be removed"));
            }

            
            User? foundMember = chatSpace.Members.FirstOrDefault(m => m.Id == memberId);

            if(foundMember is null) {
                return NotFound(new Error("Member does not exist"));
            }

            await _chatHubConnectionManager.NotifyRemovedFromChatSpace(foundMember, chatSpace);
            await _chatSpaceManager.RemoveMember(foundMember, chatSpace);  

            return new UserDto(foundMember);
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateChatSpace(UpdateChatSpace updateChatSpace)
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            string ownerId = _userManager.GetUserId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);

            if(chatSpace is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            if(chatSpace.Owner.Id != ownerId) {
                return NotFound(new Error("Chatspace can only be edited by owner"));
            }

            await _chatSpaceManager.UpdateChatSpace(updateChatSpace.Name, chatSpace);

            return NoContent();
        }
    }
} 