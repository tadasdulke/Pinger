using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IChatSpaceManager _chatSpaceManager;
        private readonly ApplicationUserManager _userManager;
        private readonly IHubContext<ChatHub> _chatHubContext;

        public ChannelController(
            ApplicationDbContext dbContext,
            ApplicationUserManager userManager,
            IChatSpaceManager chatSpaceManager,
            IHubContext<ChatHub> chatHubContext
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
            _chatHubContext = chatHubContext;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateChannel(AddChannel channelToAdd)
        {
            string userId = _userManager.GetUserId(User);
            User? owner = await _userManager.FindByIdAsync(userId);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatSpaceId);

            if(owner is null || chatSpace is null) {
                return NotFound();
            }

            List<User> members = new List<User>();
            
            foreach(string memberId in channelToAdd.MemberIds) {
                User member = await _userManager.FindByIdAsync(memberId);
                if(member is null) {
                    return NotFound();
                }

                members.Add(member);
            }

            members.Add(owner);

            Channel newChannel = new Channel {
                Name = channelToAdd.Name,
                Owner = owner,
                Members = members,
                ChatSpace = chatSpace
            };

            await _dbContext.Channel.AddAsync(newChannel);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Channel>>> GetUsersChannels()
        {
            string userId = _userManager.GetUserId(User);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatSpaceId);
            
            if(chatSpace is null) {
                return NotFound();
            }

            User? user = await _dbContext.Users.Include(u => u.Channels).ThenInclude(c => c.ChatSpace).FirstOrDefaultAsync(u => u.Id == userId);
            
            if(user is null) {
                return NotFound();
            }

            List<Channel> channels = user.Channels.Where(c => c.ChatSpace.Id == chatSpaceId).ToList();

            return channels;
        }

        [Authorize]
        [HttpGet("{channelId}")]
        public async Task<ActionResult<Channel>> GetChannel([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatSpaceId);
            
            if(chatSpace is null) {
                return NotFound();
            }

            User? user = await _dbContext.Users.Include(u => u.Channels).ThenInclude(c => c.ChatSpace).FirstOrDefaultAsync(u => u.Id == userId);
            
            if(user is null) {
                return NotFound();
            }

            List<Channel> channels = user.Channels.Where(c => c.ChatSpace.Id == chatSpaceId).ToList();
            Channel? channel = channels.FirstOrDefault(c => c.Id == channelId);

            if(channel is null) {
                return NotFound();
            }

            return channel;
        }

        [Authorize]
        [HttpPost("{channelId}/members")]
        public async Task<IActionResult> AddMembersToChannel([FromRoute] int channelId, AddUserToChannelRequest addUserToChannelRequest)
        {
            Channel? channel = await _dbContext.Channel
                .Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == channelId);
            
            if(channel is null) {
                return NotFound();
            }

            User? newMember = await _userManager.FindByIdAsync(addUserToChannelRequest.NewMemberId);

            if(newMember is null) {
                return NotFound();
            }

            channel.Members.Add(newMember);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

    }
} 