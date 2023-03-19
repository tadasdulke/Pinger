using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/channel-messages-read-times")]
    [ApiController]
    public class ChannelMessagesReadTimesController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private readonly ApplicationUserManager _userManager;

        public ChannelMessagesReadTimesController(ApplicationDbContext dbContext, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<ChannelMessagesReadTimes>> AddUserChannelReadTimes(AddUserChannelReadTimesRequest addUserChannelReadTimesRequest)
        {
            string userId = _userManager.GetUserId(User);
            User user = await _userManager.FindByIdAsync(userId);

            if(user is null) {
                return NotFound();
            }

            ChannelMessagesReadTimes? channelMessagesReadTimes = await _dbContext.ChannelMessagesReadTimes
                .Include(cmrt => cmrt.Channel)
                .Include(cmrt => cmrt.Owner)
                .Where(cmrt => cmrt.Channel.Id == addUserChannelReadTimesRequest.ChannelId)
                .FirstOrDefaultAsync(cmrt => cmrt.Owner.Id == userId);
            
            if(channelMessagesReadTimes is null) {
                Channel? channel = await _dbContext.Channel.Where(c => c.Id == addUserChannelReadTimesRequest.ChannelId).FirstOrDefaultAsync();
                if(channel is null) {
                    return NotFound();
                }

               ChannelMessagesReadTimes newReadTimes = new ChannelMessagesReadTimes {
                Owner = user,
                ReadTime = DateTime.Now,
                Channel = channel
               };

               await _dbContext.AddAsync(newReadTimes);
               await _dbContext.SaveChangesAsync();
            } else { 
                channelMessagesReadTimes.ReadTime = DateTime.Now;
                await _dbContext.SaveChangesAsync();
            }

            return Ok();
        }
    }
} 