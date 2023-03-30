using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/channel-messages")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        private readonly ApplicationUserManager _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatMessageController(
            ApplicationUserManager userManager, 
            ApplicationDbContext dbContext,
            IHubContext<ChatHub>  hubContext
        )
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        [Authorize]
        [HttpGet]
        [Route("{channelId}")]
        public async Task<ActionResult<LazyLoadChannelMessages>> GetChannelMessages([FromRoute] int channelId, [FromQuery] int offset, [FromQuery] int step, [FromQuery] int skip)
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

            List<ChannelMessage> messages = _dbContext.ChannelMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(cm => cm.Channel)
                .Include(cm => cm.Sender)
                .ThenInclude(sender => sender.ProfileImageFile)
                .Include(cm => cm.ChannelMessageFiles)
                .Where(cm => cm.Channel.Id == channelId)
                .Skip(offset + skip)
                .Take(step + 1)
                .Reverse()
                .ToList();
            
            bool hasMore = messages.Count > step;

            if(offset > 0) {
                messages.RemoveAt(messages.Count - 1);
            }

            LazyLoadChannelMessages lazyLoadChannelMessages = new LazyLoadChannelMessages {
                Messages = messages.Select(m => new ChannelMessageDto(m)).ToList(),
                HasMore = true,
            };

            if(messages.Count < step) {
                lazyLoadChannelMessages.HasMore = false;
                return lazyLoadChannelMessages;
            }

            return lazyLoadChannelMessages;
        }

        [Authorize]
        [HttpDelete]
        [Route("{messageId}")]
        public async Task<IActionResult> RemoveChannelMessage([FromRoute] int messageId)
        {
            string userId = _userManager.GetUserId(User);
            User user = await _userManager.FindByIdAsync(userId);

            if(user is null) {
                return NotFound();
            }

            ChannelMessage? channelMessage = await _dbContext.ChannelMessage
                .Include(cm => cm.Sender)
                .Include(cm => cm.ChannelMessageFiles)
                .Include(cm => cm.Channel)
                .Where(cm => cm.Sender.Id == userId)
                .Where(cm => cm.Id == messageId)
                .FirstOrDefaultAsync();

            if(channelMessage is null) {
                return NotFound();
            }

            _dbContext.ChannelMessageFile.RemoveRange(channelMessage.ChannelMessageFiles);
            _dbContext.ChannelMessage.Remove(channelMessage);
            await _dbContext.SaveChangesAsync();

            string groupName = $"{channelMessage.Channel.Id}-{channelMessage.Channel.Name}";

            List<string> senderConnectionIds = channelMessage.Sender.ConnectionInformations.Select(ci => ci.ConnectionId).ToList();

            await _hubContext.Clients.GroupExcept(groupName, senderConnectionIds).SendAsync("RemoveChannelMessage", new ChannelMessageDto(channelMessage));

            return NoContent();
        }

        [Authorize]
        [HttpPut]
        [Route("{messageId}")]
        public async Task<IActionResult> UpdateChannelMessage([FromRoute] long messageId, [FromBody] UpdatePrivateMessageRequest updatePrivateMessageRequest)
        {
            string senderId = _userManager.GetUserId(User);
            ChannelMessage? channelMessage = _dbContext.ChannelMessage
                .Include(pm => pm.Sender)
                .ThenInclude(s => s.ConnectionInformations)
                .Include(pm => pm.Sender)
                .ThenInclude(s => s.ProfileImageFile)
                .Include(pm => pm.Channel)
                .Include(pm => pm.ChannelMessageFiles)
                .Where(pm => pm.Sender.Id == senderId)
                .Where(pm => pm.Id == messageId)
                .FirstOrDefault();

            if(channelMessage is null) {
                return NotFound();
            }

            channelMessage.Body = updatePrivateMessageRequest.Body;
            channelMessage.Edited = true;
            _dbContext.ChannelMessage.Update(channelMessage);
            await _dbContext.SaveChangesAsync();

            string groupName = $"{channelMessage.Channel.Id}-{channelMessage.Channel.Name}";

            List<string> senderConnectionIds = channelMessage.Sender.ConnectionInformations.Select(ci => ci.ConnectionId).ToList();

            await _hubContext.Clients.GroupExcept(groupName, senderConnectionIds).SendAsync("ChannelMessageUpdated", new ChannelMessageDto(channelMessage));

            return NoContent();
        }
    }
} 