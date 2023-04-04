using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/channel-read-times")]
    [ApiController]
    public class ChannelReadTimesController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IChatSpaceManager _chatSpaceManager;
        private readonly ApplicationUserManager _userManager;

        public ChannelReadTimesController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IChatSpaceManager chatSpaceManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
        }

        [Authorize]
        [HttpPut]
        [Route("{channelId}")]
        public async Task<IActionResult> UpdateChannelReadTime([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            
            ChannelReadTime? channelReadTime = await _dbContext.ChannelReadTimes
                .Include(crt => crt.Owner)
                .Where(crt => crt.Owner.Id == userId)
                .FirstOrDefaultAsync(crt => crt.Channel.Id == channelId);
            
            if(channelReadTime is null) {
                Channel? channel = await _dbContext.Channel.FirstOrDefaultAsync(c => c.Id == channelId);
                if(channel is null) {
                    return NotFound();
                }

                User? owner = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if(owner is null) {
                    return NotFound();
                }

                ChannelReadTime newChannelReadTime = new ChannelReadTime {
                    Owner = owner,
                    LastReadTime = DateTime.Now,
                    Channel = channel
                };

                _dbContext.ChannelReadTimes.Add(newChannelReadTime);
                await _dbContext.SaveChangesAsync();

                return NoContent();
            }

            channelReadTime.LastReadTime = DateTime.Now;

            _dbContext.ChannelReadTimes.Update(channelReadTime);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
} 