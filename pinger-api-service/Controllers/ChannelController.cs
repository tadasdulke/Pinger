using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IChatSpaceManager _chatSpaceManager;
        private IChannelManager _channelManager;
        private readonly ApplicationUserManager _userManager;
        private readonly IChatHubConnectionManager _chathubConnectionManager;
        
        private readonly IHubContext<ChatHub> _chatHubContext;

        public ChannelController(
            ApplicationDbContext dbContext,
            ApplicationUserManager userManager,
            IChatSpaceManager chatSpaceManager,
            IChannelManager channelManager,
            IHubContext<ChatHub> chatHubContext,
            IChatHubConnectionManager chatHubConnectionManager
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _chatSpaceManager = chatSpaceManager;
            _channelManager = channelManager;
            _chatHubContext = chatHubContext;
            _chathubConnectionManager = chatHubConnectionManager;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ChannelDto>> CreateChannel(AddChannel channelToAdd)
        {
            string userId = _userManager.GetUserId(User);
            User? owner = await _userManager.GetUserAsync(userId);

            if(owner is null) {
                return NotFound(new Error("User does not exist"));
            }

            int chatSpaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatSpaceId);

            if(chatSpace is null) {
                return NotFound(new Error("Chatspace does not exist"));
            }

            Channel channel = await _channelManager.CreateChannel(channelToAdd.Name, owner, chatSpace);
            await _chathubConnectionManager.AddUserConnectionToChannelAsync(owner.ConnectionInformations.ToList(), channel);

            return new ChannelDto(channel);
        }

        [Authorize]
        [HttpPut]
        [Route("{channelId}")]
        public async Task<ActionResult<ChannelDto>> UpdateChannel([FromRoute] int channelId, [FromBody] UpdateChannel updateChannel)
        {
            string userId = _userManager.GetUserId(User);
            Channel? channel = await _channelManager.GetChannelAsync(channelId);

            if(channel is null) {
                return NotFound(new Error("Channel not found"));
            }

            if(channel.Owner.Id != userId) {
                return Unauthorized(new Error("User is does not own this channel"));
            }

            Channel updatedChannel = await _channelManager.UpdateChannel(channel, updateChannel.Name);

            return new ChannelDto(updatedChannel);
        }

        [Authorize]
        [HttpDelete]
        [Route("{channelId}")]
        public async Task<ActionResult<ChannelDto>> DeleteChannel([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            Channel? channel = await _channelManager.GetChannelAsync(channelId);

            if(channel is null) {
                return NotFound(new Error("Channel not found"));
            }

            if(channel.Owner.Id != userId) {
                return Unauthorized(new Error("User is does not own this channel"));
            }

            await _channelManager.RemoveChannel(channel);
            await _chathubConnectionManager.NotifyRemovedFromChannelUsers(channel, channel.Members.ToList());
            return new ChannelDto(channel);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ChannelDto>>> GetUsersChannels([FromQuery] string? search)
        {
            string userId = _userManager.GetUserId(User);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            ChatSpace? chatSpace = _chatSpaceManager.GetChatSpaceById(chatSpaceId);
            
            if(chatSpace is null) {
                return NotFound(new Error("Chatspace not found"));
            }

            User? user = await _userManager.GetUserAsync(userId);
            
            if(user is null) {
                return NotFound(new Error("User not found"));
            }


            List<Channel> channels = user.Channels.Where(c => c.ChatSpace.Id == chatSpaceId).ToList();
            if(search is not null) {
                channels = channels.Where(c => c.Name.Contains(search.ToLower())).ToList();
            }

            List<ChannelDto> channelDtos = channels.Select(c => new ChannelDto(c)).ToList();

            return channelDtos;
        }

        [Authorize]
        [HttpGet("{channelId}")]
        public async Task<ActionResult<ChannelDto>> GetChannel([FromRoute] int channelId)
        {
            string userId = _userManager.GetUserId(User);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            
            Channel? channel = await _channelManager.GetChannelAsync(channelId);

            if(channel is null || channel.ChatSpace.Id != chatSpaceId) {
                return NotFound(new Error("Channel not found"));
            }

            return new ChannelDto(channel);
        }

        [Authorize]
        [HttpPost("{channelId}/members")]
        public async Task<IActionResult> AddMembersToChannel([FromRoute] int channelId, AddUserToChannelRequest addUserToChannelRequest)
        {
            string userId = _userManager.GetUserId(User);
            Channel? channel = await _channelManager.GetChannelAsync(channelId);
            
            if(channel is null) {
                return NotFound(new Error("Channel not found"));
            }

            User? newMember = await _userManager.GetUserAsync(addUserToChannelRequest.NewMemberId);

            if(newMember is null) {
                return NotFound(new Error("Member not found"));
            }

            await _channelManager.AddUserToChannel(newMember, channel);
            await _chathubConnectionManager.NotifyUserAddedToChannel(channel, newMember);
            return NoContent();
        }

        [Authorize]
        [HttpGet("{channelId}/members")]
        public async Task<ActionResult<List<UserDto>>> GetChannelMembers([FromRoute] int channelId, [FromQuery] string? search)
        {
            Channel? channel = await _channelManager.GetChannelAsync(channelId);
            
            if(channel is null) {
                return NotFound(new Error("Channel not found"));
            }

            if(search is not null) {
                return channel.Members.Where(m => m.UserName.Contains(search.ToLower())).Select(u => new UserDto(u)).ToList();
            }

            return channel.Members.Select(m => new UserDto(m)).ToList();
        }

        [Authorize]
        [HttpDelete("{channelId}/members/{userToDeleteId}")]
        public async Task<IActionResult> RemoveMembersFromChannel([FromRoute] int channelId, [FromRoute] string userToDeleteId)
        {
            string userId = _userManager.GetUserId(User);

            Channel? channel = await _channelManager.GetChannelAsync(channelId);
            
            if(channel is null) {
                return NotFound("Channel not found");
            }

            if(userId != channel.Owner.Id) {
                return Unauthorized("Only channel owner can remove users");
            }


            if(userId == userToDeleteId) {
                return BadRequest("Channel owner can't be removed");
            }

            User? memberToDelete = channel.Members.FirstOrDefault(m => m.Id == userToDeleteId);

            if(memberToDelete is null) {
                return NotFound("User not found");
            }

            await _channelManager.RemoveUserFromChannel(channel, memberToDelete);
            await _chathubConnectionManager.NotifyRemovedFromChannelUsers(channel, new List<User>{memberToDelete});
            return NoContent();
        }

    }
} 