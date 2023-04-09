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
        private IContactedUsersManager _contactedUsersManager;
        private IConnectionInformationManager _connectionInformationManager;
        private IFileManager _fileManager;
        private readonly ApplicationUserManager _userManager;
        private IChatHubConnectionManager _chatHubConnectionManager;
        private readonly IHubContext<ChatHub> _hubContext;

        public PrivateMessagesController(
            ApplicationDbContext dbContext, 
            ApplicationUserManager userManager, 
            IPrivateMessagesManager privateMessagesManager,
            IHubContext<ChatHub> hubContext,   
            IFileManager fileManager,
            IContactedUsersManager contactedUsersManager,
            IConnectionInformationManager connectionInformationManager,
            IChatHubConnectionManager chatHubConnectionManager
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _privateMessagesManager = privateMessagesManager;
            _hubContext = hubContext;
            _fileManager = fileManager;
            _contactedUsersManager = contactedUsersManager;
            _connectionInformationManager = connectionInformationManager;
            _chatHubConnectionManager = chatHubConnectionManager;
        }

        [Authorize]
        [HttpGet]
        [Route("unread/{receiverId}")]
        public async Task<ActionResult<List<PrivateMessageDto>>> GetUnreadMessages([FromRoute] string receiverId)
        {
            string senderId = _userManager.GetUserId(User);
            ContactedUserInfo? contactedUserInfo = await _contactedUsersManager.GetContactedUserInfoAsync(senderId, receiverId);

            if(contactedUserInfo is null) {
                return NotFound(new Error("Contacted user info not found"));
            }

            int chatSpaceId = _userManager.GetChatSpaceId(User);

            List<PrivateMessage> unreadPrivateMessages = await _privateMessagesManager.GetPrivateMessagesAfterTime(
                receiverId,
                senderId,
                chatSpaceId,
                contactedUserInfo.LastReadTime
            );
            
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
            ContactedUserInfo? contactedUserInfo = await _contactedUsersManager.GetContactedUserInfoAsync(senderId, receiverId);

            if(contactedUserInfo is null) {
                return NotFound(new Error("Contacted user info not found"));
            }

            int chatSpaceId = _userManager.GetChatSpaceId(User);

            List<PrivateMessage> oldPrivateMessages = await _privateMessagesManager.GetPrivateMessagesBeforeTime(
                receiverId,
                senderId,
                chatSpaceId,
                contactedUserInfo.LastReadTime,
                offset,
                skip,
                step
            );
            
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
                return NotFound(new Error("Message not found"));
            }

            await _chatHubConnectionManager.NotifyUserPrivateMessageRemoved(privateMessage);

            return new PrivateMessageDto(privateMessage);
        }

        [Authorize]
        [HttpPut]
        [Route("{messageId}")]
        public async Task<ActionResult<PrivateMessageDto>> UpdatePrivateMessage([FromRoute] long messageId, [FromBody] UpdatePrivateMessageRequest updatePrivateMessageRequest)
        {
            string senderId = _userManager.GetUserId(User);
        
            PrivateMessage? editedPrivateMessage = await _privateMessagesManager.UpdatePrivateMessage(senderId, messageId, updatePrivateMessageRequest.Body);
            
            if(editedPrivateMessage is null) {
                return NotFound(new Error("Message not found"));
            } 

            await _chatHubConnectionManager.NotifyUserPrivateMessageUpdated(editedPrivateMessage);


            return new PrivateMessageDto(editedPrivateMessage);
        }
    }
} 