using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/channel-messages")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        private readonly ApplicationUserManager _userManager;
        private readonly ApplicationDbContext _dbContext;

        public ChatMessageController(ApplicationUserManager userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [Authorize]
        [HttpGet]
        [Route("{channelId}")]
        public async Task<ActionResult<List<ChannelMessage>>> GetChannelMessages([FromRoute] int channelId, [FromQuery] int offset, [FromQuery] int step)
        {
            string userId = _userManager.GetUserId(User);
            
            User? user = await _dbContext.Users
                .Include(u => u.Channels)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if(user is null) {
                return NotFound();
            }

            Channel? channel = user.Channels.FirstOrDefault(c => c.Id == channelId);

            if(channel is null) {
                return NotFound();
            }

            var messages = _dbContext.ChannelMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(cm => cm.Channel)
                .Where(cm => cm.Channel.Id == channelId)
                .Skip(offset)
                .Take(step)
                .Reverse()
                .ToList();

            return messages;
        }
    }
} 