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
        public async Task<ActionResult<ChannelUnreadMessages>> GetUnreadMessages([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            
            ChannelReadTime? channelReadTime = await _channelReadTimeManager.GetUsersChannelReadTimes(channelId, userId);

            List<ChannelMessage> messages = channelReadTime is not null ? await _channelMessageManager.GetChannelMessagesAfterTime(channelReadTime.LastReadTime, channelId) : new List<ChannelMessage>();

            return new ChannelUnreadMessages(messages, channelReadTime is not null);
        }

        [Authorize]
        [HttpGet]
        [Route("{channelId}")]
        public async Task<ActionResult<LazyLoadChannelMessages>> GetChannelMessages([FromRoute] int channelId, [FromQuery] int offset, [FromQuery] int step, [FromQuery] int skip)
        {
            string userId = _userManager.GetUserId(User);

            ChannelReadTime? channelReadTime = await _channelReadTimeManager.GetUsersChannelReadTimes(channelId, userId);
            DateTime? LastReadTime = DateTime.Now;
            if(channelReadTime is not null) {
                LastReadTime = channelReadTime.LastReadTime;
            }


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