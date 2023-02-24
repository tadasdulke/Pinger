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
        private readonly UserManager<User> _userManager;

        public ChatSpacesController(ApplicationDbContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateChatSpace([FromBody] NewChatSpace newChatSpace)
        {
            string ownerId = _userManager.GetUserId(User);
            User owner = await _userManager.FindByIdAsync(ownerId);
            ChatSpace chatSpace = new ChatSpace();
            chatSpace.Name = newChatSpace.Name;
            chatSpace.Members.Add(owner);
            _dbContext.ChatSpaces.Add(chatSpace);
            _dbContext.SaveChanges();
            return Ok();
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ChatSpaceResponse>>> GetUsersChatSpaces()
        {
            string userId = _userManager.GetUserId(User);
            List<ChatSpace> chatSpaces = await _dbContext.ChatSpaces.Include(x => x.Members).Where(x => x.Members.Any(m => m.Id == userId)).ToListAsync();
            List<ChatSpaceResponse> chatSpaceResponses = chatSpaces.Select(x => new ChatSpaceResponse{ Id = x.Id, Name = x.Name }).ToList();
            return chatSpaceResponses;
        }
    }
} 