using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatSpacesController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IChatSpaceManager _chatSpaceManager;
        private readonly ApplicationUserManager _userManager;

        public ChatSpacesController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IChatSpaceManager chatSpaceManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ChatSpaceDto>>> GetChatSpaces()
        {
            List<ChatSpace> chatSpaces = await _dbContext.ChatSpace.ToListAsync();
            return chatSpaces.Select(cs => new ChatSpaceDto(cs)).ToList();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateChatSpace([FromBody] NewChatSpace newChatSpace)
        {
            string ownerId = _userManager.GetUserId(User);
            User owner = await _userManager.FindByIdAsync(ownerId);
            ChatSpace chatSpace = new ChatSpace();
            chatSpace.Name = newChatSpace.Name.Trim();

            bool chatSpaceAlreadyExists = _dbContext.ChatSpace.Any(chatSpace => chatSpace.Name.ToLower() == newChatSpace.Name.Trim().ToLower());

            if(chatSpaceAlreadyExists) {
                return BadRequest("Chatspace already exists");
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
        public async Task<ActionResult<List<UserDto>>> GetChatSpaceMembers([FromQuery(Name = "search")]  string search)
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _chatSpaceManager.GetChatSpaceById(chatspaceId);
            
            if(chatSpace is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            List<User> members = chatSpace.Members.ToList();
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
    }
} 