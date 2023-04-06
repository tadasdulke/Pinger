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
        private readonly ApplicationUserManager _userManager;

        public ChatSpacesController(ApplicationDbContext dbContext, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ChatSpace>>> GetChatSpaces()
        {
            List<ChatSpace> chatSpaces = await _dbContext.ChatSpace.ToListAsync();
            return chatSpaces;
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
        public async Task<ActionResult<ChatSpace>> GetChatSpaceById([FromRoute] int chatspaceId)
        {
            string userId = _userManager.GetUserId(User);
            ChatSpace? chatspace = await _dbContext.ChatSpace.Include(cs => cs.Members).FirstOrDefaultAsync(cs => cs.Id == chatspaceId);
            
            if(chatspace is null) {
                return NotFound();
            }

            bool isUserInMembers = chatspace.Members.Any(m => m.Id == userId);

            if(isUserInMembers) {
                return chatspace;
            }

            return BadRequest();
        }

        [Authorize]
        [HttpPost("{chatspaceId}/join")]
        public async Task<ActionResult<ChatSpace>> JoinChatSpace([FromRoute] int chatspaceId)
        {
            string userId = _userManager.GetUserId(User);
            User user = await _userManager.FindByIdAsync(userId);
            ChatSpace? chatspace = await _dbContext.ChatSpace.Include(cs => cs.Members).FirstOrDefaultAsync(cs => cs.Id == chatspaceId);
            
            if(chatspace is null) {
                return NotFound();
            }

            chatspace.Members.Add(user);
            _dbContext.SaveChanges();

            return NoContent();

        }

        [Authorize]
        [HttpGet("joined")]
        public async Task<ActionResult<List<ChatSpaceResponse>>> GetUsersChatSpaces()
        {
            string userId = _userManager.GetUserId(User);
            List<ChatSpace> chatSpaces = await _dbContext.ChatSpace.Include(x => x.Members).Where(x => x.Members.Any(m => m.Id == userId)).ToListAsync();
            List<ChatSpaceResponse> chatSpaceResponses = chatSpaces.Select(x => new ChatSpaceResponse{ Id = x.Id, Name = x.Name }).ToList();
            return chatSpaceResponses;
        }

        [Authorize]
        [HttpGet("members")]
        public async Task<ActionResult<List<User>>> GetChatSpaceMembers([FromQuery(Name = "search")]  string search)
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _dbContext.ChatSpace.Include(x => x.Members).ThenInclude(u => u.ProfileImageFile).FirstOrDefaultAsync(c => c.Id == chatspaceId);
            
            if(chatSpace is null) {
                return NotFound();
            }

            List<User> members = chatSpace.Members.ToList();
            List<User> filteredMembers = members.Where(m => m.UserName.ToLower().Contains(search.ToLower())).ToList();
            
            return filteredMembers;
        }

        [Authorize]
        [HttpGet("members/{memberId}")]
        public async Task<ActionResult<UserDto>> GetChatSpaceMember([FromRoute] string memberId)
        {
            int chatspaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = await _dbContext.ChatSpace.Include(x => x.Members).ThenInclude(u => u.ProfileImageFile).FirstOrDefaultAsync(c => c.Id == chatspaceId);
            
            if(chatSpace is null) {
                return NotFound();
            }

            
            User? foundMember = chatSpace.Members.FirstOrDefault(m => m.Id == memberId);

            if(foundMember is null) {
                return NotFound();
            }

            return new UserDto(foundMember);
        }
    }
} 