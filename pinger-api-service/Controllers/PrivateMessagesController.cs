using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/private-messages")]
    [ApiController]
    public class PrivateMessagesController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private IPrivateMessagesManager _privateMessagesManager;
        private IFileManager _fileManager;
        private readonly ApplicationUserManager _userManager;
        private readonly IHubContext<ChatHub> _hubContext;

        public PrivateMessagesController(
            ApplicationDbContext dbContext, 
            ApplicationUserManager userManager, 
            IPrivateMessagesManager privateMessagesManager,
            IHubContext<ChatHub> hubContext,   
            IFileManager fileManager 
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _privateMessagesManager = privateMessagesManager;
            _hubContext = hubContext;
            _fileManager = fileManager;
        }

        [Authorize]
        [HttpGet]
        [Route("unread/{receiverId}")]
        public async Task<ActionResult<List<PrivateMessageDto>>> GetUnreadMessages([FromRoute] string receiverId)
        {
            string senderId = _userManager.GetUserId(User);
            ContactedUserInfo? contactedUserInfo = await _dbContext.ContactedUserInfo
                .Include(cui => cui.Owner)
                .Include(cui => cui.ContactedUser)
                .Where(cui => cui.Owner.Id == senderId)
                .FirstOrDefaultAsync(cui => cui.ContactedUser.Id == receiverId);

            if(contactedUserInfo is null) {
                return NotFound();
            }

            int chatSpaceId = _userManager.GetChatSpaceId(User);

            var LastReadTime = contactedUserInfo.LastReadTime;
            List<PrivateMessage> unreadPrivateMessages = _dbContext.PrivateMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(pm => pm.Receiver)
                .Include(pm => pm.Sender)
                .ThenInclude(sender => sender.ProfileImageFile)
                .Include(pm => pm.ChatSpace)
                .Include(pm => pm.PrivateMessageFiles)
                .Where(pm => (pm.Receiver.Id == receiverId) || (pm.Receiver.Id == senderId))
                .Where(pm => (pm.Sender.Id == senderId) || (pm.Sender.Id == receiverId))
                .Where(pm => pm.ChatSpace.Id == chatSpaceId)
                .Where(pm => pm.SentAt > LastReadTime)
                .Reverse()
                .ToList();
            
            return unreadPrivateMessages.Select(m => new PrivateMessageDto(m)).ToList();
        }

        [Authorize]
        [HttpGet]
        [Route("{receiverId}")]
        public async Task<ActionResult<LazyLoadPrivateMessages>> GetPrivateMessages(
            [FromRoute] string receiverId,
            [FromQuery] int offset,
            [FromQuery] int step, 
            [FromQuery] int skip
        )
        {
            string senderId = _userManager.GetUserId(User);
            User user = await _userManager.FindByIdAsync(senderId);
            
            ContactedUserInfo? contactedUserInfo = await _dbContext.ContactedUserInfo
                .Include(cui => cui.Owner)
                .Include(cui => cui.ContactedUser)
                .Where(cui => cui.Owner.Id == senderId)
                .FirstOrDefaultAsync(cui => cui.ContactedUser.Id == receiverId);

            if(contactedUserInfo is null) {
                return NotFound();
            }

            if(contactedUserInfo.LastReadTime is null) {
                contactedUserInfo.LastReadTime = DateTime.Now;

                _dbContext.ContactedUserInfo.Update(contactedUserInfo);
                await _dbContext.SaveChangesAsync();
            }

            int chatSpaceId = _userManager.GetChatSpaceId(User);

            var LastReadTime = contactedUserInfo.LastReadTime;

            List<PrivateMessage> oldPrivateMessages = _dbContext.PrivateMessage
                .OrderByDescending(cm => cm.SentAt)
                .Include(pm => pm.Receiver)
                .Include(pm => pm.Sender)
                .ThenInclude(sender => sender.ProfileImageFile)
                .Include(pm => pm.ChatSpace)
                .Include(pm => pm.PrivateMessageFiles)
                .Where(pm => (pm.Receiver.Id == receiverId) || (pm.Receiver.Id == senderId))
                .Where(pm => (pm.Sender.Id == senderId) || (pm.Sender.Id == receiverId))
                .Where(pm => pm.ChatSpace.Id == chatSpaceId)
                .Where(pm => pm.SentAt <= LastReadTime)
                .Skip(offset + skip)
                .Take(step + 1)
                .Reverse()
                .ToList();
            
            bool hasMore = oldPrivateMessages.Count > step;

            if(hasMore) {
                oldPrivateMessages.RemoveAt(0);
            }

            LazyLoadPrivateMessages lazyLoadPrivateMessages = new LazyLoadPrivateMessages {
                    Messages = oldPrivateMessages.Select(m => new PrivateMessageDto(m)).ToList(),
                    HasMore = true
            };

            if(oldPrivateMessages.Count < step) {
                lazyLoadPrivateMessages.HasMore = false;
                return lazyLoadPrivateMessages;
            }

            return lazyLoadPrivateMessages;
        }

        [Authorize]
        [HttpDelete]
        [Route("{messageId}")]
        public async Task<ActionResult<PrivateMessageDto>> RemovePrivateMessage([FromRoute] long messageId)
        {
            string senderId = _userManager.GetUserId(User);
            PrivateMessage? privateMessage = await _privateMessagesManager.RemovePrivateMessage(messageId, senderId);

            if(privateMessage is null) {
                return NotFound();
            }

            
            List<ConnectionInformation> receiverConnectionInformation = privateMessage.Receiver.ConnectionInformations.ToList(); 
            List<string> connectionIds = receiverConnectionInformation.Select(ci => ci.ConnectionId).ToList();

            await _hubContext.Clients.Clients(connectionIds).SendAsync("PrivateMessageRemoved", new PrivateMessageDto(privateMessage));

            foreach (PrivateMessageFile pmf in privateMessage.PrivateMessageFiles)
            {
                _fileManager.RemoveFile(pmf.Path);
            }

            return new PrivateMessageDto(privateMessage);
        }

        [Authorize]
        [HttpPut]
        [Route("{messageId}")]
        public async Task<ActionResult<PrivateMessageDto>> UpdatePrivateMessage([FromRoute] long messageId, [FromBody] UpdatePrivateMessageRequest updatePrivateMessageRequest)
        {
            string senderId = _userManager.GetUserId(User);
            PrivateMessage? messageToEdit = _dbContext.PrivateMessage
                .Include(pm => pm.Receiver)
                .ThenInclude(receiver => receiver.ConnectionInformations)
                .Include(pm => pm.Sender)
                .ThenInclude(s => s.ProfileImageFile)
                .Include(pm => pm.PrivateMessageFiles)
                .Where(pm => pm.Sender.Id == senderId)
                .Where(pm => pm.Id == messageId)
                .FirstOrDefault();

            if(messageToEdit is null) {
                return NotFound();
            }

            messageToEdit.Body = updatePrivateMessageRequest.Body;
            messageToEdit.Edited = true;
            _dbContext.PrivateMessage.Update(messageToEdit);
            await _dbContext.SaveChangesAsync();

            
            List<ConnectionInformation> receiverConnectionInformation = messageToEdit.Receiver.ConnectionInformations.ToList(); 
            List<string> connectionIds = receiverConnectionInformation.Select(ci => ci.ConnectionId).ToList();

            await _hubContext.Clients.Clients(connectionIds).SendAsync("PrivateMessageUpdated", new PrivateMessageDto(messageToEdit));


            return new PrivateMessageDto(messageToEdit);
        }
    }
} 