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
        public async Task<ActionResult<ChannelDto>> CreateChannel(AddChannel channelToAdd)
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

            return new ChannelDto(newChannel);
        }

        [Authorize]
        [HttpPut]
        [Route("{channelId}")]
        public async Task<ActionResult<ChannelDto>> UpdateChannel([FromRoute] int channelId, [FromBody] UpdateChannel updateChannel)
        {
            string userId = _userManager.GetUserId(User);
            Channel? channel = await _dbContext.Channel.Include(c => c.Owner).FirstOrDefaultAsync(c => c.Id == channelId);

            if(channel is null) {
                return NotFound();
            }

            if(channel.Owner.Id != userId) {
                return Unauthorized();
            }

            channel.Name = updateChannel.Name;
            _dbContext.Channel.Update(channel);
            await _dbContext.SaveChangesAsync();

            return new ChannelDto(channel);
        }

        [Authorize]
        [HttpDelete]
        [Route("{channelId}")]
        public async Task<ActionResult<ChannelDto>> DeleteChannel([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            Channel? channel = await _dbContext.Channel
                .Include(c => c.Owner)
                .Include(c => c.Messages)
                .ThenInclude(m => m.ChannelMessageFiles)
                .Include(c => c.Members)
                .ThenInclude(m => m.ConnectionInformations)
                .FirstOrDefaultAsync(c => c.Id == channelId);

            if(channel is null) {
                return NotFound();
            }

            if(channel.Owner.Id != userId) {
                return Unauthorized();
            }
            
            List<ChannelMessageFile> channelMessageFiles = channel.Messages.Aggregate(
                new List<ChannelMessageFile>(),
                (acc, message) => acc.Concat(message.ChannelMessageFiles).ToList()
            );

            _dbContext.ChannelMessageFile.RemoveRange(channelMessageFiles);
            _dbContext.ChannelMessage.RemoveRange(channel.Messages);
            _dbContext.Channel.Remove(channel);
            await _dbContext.SaveChangesAsync();

            List<string?> connectionIds = channel.Members.Aggregate(
                new List<string?>(),
                (acc, member) => acc.Concat(member.ConnectionInformations.Select(ci => ci.ConnectionId)).ToList()
            );
            
            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("UserRemovedFromChannel", new ChannelDto(channel));
            return new ChannelDto(channel);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ChannelDto>>> GetUsersChannels()
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
            List<ChannelDto> channelDtos = channels.Select(c => new ChannelDto(c)).ToList();

            return channelDtos;
        }

        [Authorize]
        [HttpGet("{channelId}")]
        public async Task<ActionResult<ChannelDto>> GetChannel([FromRoute] int channelId)
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

            return new ChannelDto(channel);
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

            User? newMember = await _userManager.Users
                .Include(u => u.ConnectionInformations)
                .FirstOrDefaultAsync(u => u.Id == addUserToChannelRequest.NewMemberId);

            if(newMember is null) {
                return NotFound();
            }

            channel.Members.Add(newMember);
            await _dbContext.SaveChangesAsync();

            List<string> connectionIds = newMember.ConnectionInformations.Select(ci => ci.ConnectionId).ToList();
            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("UserAddedToChannel", new ChannelDto(channel));
            return NoContent();
        }

        [Authorize]
        [HttpGet("{channelId}/members")]
        public async Task<ActionResult<List<UserDto>>> GetChannelMembers([FromRoute] int channelId, [FromQuery] string? search)
        {
            Channel? channel = await _dbContext.Channel
                .Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == channelId);
            
            if(channel is null) {
                return NotFound();
            }

            if(search is not null) {
                return channel.Members.Where(m => m.UserName.Contains(search)).Select(u => new UserDto(u)).ToList();
            }

            return channel.Members.Select(m => new UserDto(m)).ToList();
        }

        [Authorize]
        [HttpDelete("{channelId}/members/{userToDeleteId}")]
        public async Task<IActionResult> RemoveMembersFromChannel([FromRoute] int channelId, [FromRoute] string userToDeleteId)
        {
            string userId = _userManager.GetUserId(User);

            Channel? channel = await _dbContext.Channel
                .Include(c => c.Members)
                .ThenInclude(m => m.ConnectionInformations)
                .Include(c => c.Owner)
                .FirstOrDefaultAsync(c => c.Id == channelId);
            
            if(channel is null) {
                return NotFound();
            }

            if(userId != channel.Owner.Id) {
                return BadRequest();
            }


            if(userId == userToDeleteId) {
                return BadRequest();
            }

            User? memberToDelete = channel.Members.FirstOrDefault(m => m.Id == userToDeleteId);

            if(memberToDelete is null) {
                return NotFound();
            }

            channel.Members.Remove(memberToDelete);
            _dbContext.Channel.Update(channel);
            await _dbContext.SaveChangesAsync();

            List<string> connectionIds = memberToDelete.ConnectionInformations.Select(ci => ci.ConnectionId).ToList();
            await _chatHubContext.Clients.Clients(connectionIds).SendAsync("UserRemovedFromChannel", new ChannelDto(channel));

            return NoContent();
        }

    }
} 