using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace pinger_api_service
{
    [Route("api/channel-messages")]
    [ApiController]
    public class ChatMessageController : ControllerBase
    {
        private readonly ApplicationUserManager _userManager;
        private readonly IChannelReadTimeManager _channelReadTimeManager;
        private readonly IChannelMessageManager _channelMessageManager;
        private readonly IChatHubConnectionManager _chatHubConnectionManager;
        private readonly IChannelManager _channelManager;

        public ChatMessageController(
            ApplicationUserManager userManager, 
            ApplicationDbContext dbContext,
            IChannelReadTimeManager channelReadTimeManager,
            IChannelMessageManager channelMessageManager,
            IChannelManager channelManager,
            IChatHubConnectionManager chatHubConnectionManager
        )
        {
            _userManager = userManager;
            _channelReadTimeManager = channelReadTimeManager;
            _channelMessageManager = channelMessageManager;
            _channelManager = channelManager;
            _chatHubConnectionManager = chatHubConnectionManager;
        }

        [Authorize]
        [HttpGet]
        [Route("unread/{channelId}")]
        public async Task<ActionResult<List<ChannelMessageDto>>> GetUnreadMessages([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _userManager.GetUserAsync(userId);

            if(user is null) {
                return NotFound(new Error("User not found"));
            }

            Channel? channel = await _channelManager.GetChannelAsync(channelId);

            if(channel is null) {
                return NotFound(new Error("Channel not found"));
            }
            
            ChannelReadTime? channelReadTime = await _channelReadTimeManager.GetUsersChannelReadTime(user, channel);

            if(channelReadTime is null) {
                return NotFound(new Error("Channel readtime not found"));
            }

            DateTime? LastReadTime = channelReadTime.LastReadTime;

            List<ChannelMessage> messages = await _channelMessageManager.GetChannelMessagesAfterTime(LastReadTime, channelId);
            
            return messages.Select(m => new ChannelMessageDto(m)).ToList();
        }

        [Authorize]
        [HttpGet]
        [Route("{channelId}")]
        public async Task<ActionResult<LazyLoadChannelMessages>> GetChannelMessages([FromRoute] int channelId, [FromQuery] int offset, [FromQuery] int step, [FromQuery] int skip)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _userManager.GetUserAsync(userId);

            if(user is null) {
                return NotFound(new Error("User not found"));
            }

            Channel? channel = user.Channels.FirstOrDefault(c => c.Id == channelId);

            if(channel is null) {
                return NotFound("Channel not found");
            }

            ChannelReadTime channelReadTime = await _channelReadTimeManager.GetUsersChannelReadTime(user, channel);

            DateTime? LastReadTime = channelReadTime.LastReadTime;

            List<ChannelMessage> messages = await _channelMessageManager.GetChannelMessagesBeforeTime(
                LastReadTime,
                channelId,
                offset,
                skip,
                step
            );
            
            bool hasMore = messages.Count > step;

            if(hasMore) {
                messages.RemoveAt(0);
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
        public async Task<ActionResult<ChannelMessageDto>> RemoveChannelMessage([FromRoute] int messageId)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _userManager.FindByIdAsync(userId);

            if(user is null) {
                return NotFound(new Error("User not found"));
            }

            ChannelMessage? channelMessage = await _channelMessageManager.GetChannelMessageAsync(messageId, userId);

            if(channelMessage is null) {
                return NotFound(new Error("Message not found"));
            }

            await _channelMessageManager.RemoveChannelMessage(new List<ChannelMessage>{channelMessage});
            await _chatHubConnectionManager.NotifyUserRemovedMessage(channelMessage.Channel, channelMessage.Sender, channelMessage);

            return new ChannelMessageDto(channelMessage);
        }

        [Authorize]
        [HttpPut]
        [Route("{messageId}")]
        public async Task<ActionResult<ChannelMessageDto>> UpdateChannelMessage([FromRoute] long messageId, [FromBody] UpdatePrivateMessageRequest updatePrivateMessageRequest)
        {
            string senderId = _userManager.GetUserId(User);
            ChannelMessage? channelMessage = await _channelMessageManager.GetChannelMessageAsync(messageId, senderId);

            if(channelMessage is null) {
                return NotFound(new Error("Message not found"));
            }

            await _channelMessageManager.UpdateChannelMessageAsync(channelMessage, updatePrivateMessageRequest.Body);
            await _chatHubConnectionManager.NotifyUserUpdatedMessage(channelMessage.Channel, channelMessage.Sender, channelMessage);

            return new ChannelMessageDto(channelMessage);
        }
    }
} 