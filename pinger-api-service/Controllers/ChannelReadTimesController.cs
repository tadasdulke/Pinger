using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/channel-read-times")]
    [ApiController]
    public class ChannelReadTimesController : ControllerBase
    {
        
        private IChannelReadTimeManager _channelReadTimeManager;
        private IChannelManager _channelManager;
        private IChatSpaceManager _chatSpaceManager;
        private readonly ApplicationUserManager _userManager;

        public ChannelReadTimesController(IChannelManager channelManager, IChannelReadTimeManager channelReadTimeManager, ApplicationUserManager userManager, IChatSpaceManager chatSpaceManager)
        {
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
            _channelManager = channelManager;
            _channelReadTimeManager = channelReadTimeManager;
        }

        [Authorize]
        [HttpPut]
        [Route("{channelId}")]
        public async Task<IActionResult> UpdateChannelReadTime([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            
            ChannelReadTime? channelReadTime = await _channelReadTimeManager.GetUsersChannelReadTimes(channelId, userId);
            
            if(channelReadTime is null) {
                Channel? channel = await _channelManager.GetChannelAsync(channelId);
                if(channel is null) {
                    return NotFound(new Error("Channel not found"));
                }

                User? owner = await _userManager.GetUserAsync(userId);

                if(owner is null) {
                    return NotFound(new Error("User not found"));
                }

                await _channelReadTimeManager.CreateUsersChannelReadTime(owner, channel);

                return NoContent();
            }

            await _channelReadTimeManager.UpdateUsersChannelReadTime(channelReadTime);
            return NoContent();
        }
    }
} 