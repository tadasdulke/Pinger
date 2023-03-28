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
        private readonly ApplicationUserManager _userManager;
        private readonly IHubContext<ChatHub> _hubContext;

        public PrivateMessagesController(
            ApplicationDbContext dbContext, 
            ApplicationUserManager userManager, 
            IPrivateMessagesManager privateMessagesManager,
            IHubContext<ChatHub> hubContext    
        )
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _privateMessagesManager = privateMessagesManager;
            _hubContext = hubContext;
        }

        [Authorize]
        [HttpGet]
        [Route("{receiverId}")]
        public ActionResult<List<PrivateMessageDto>> GetPrivateMessages([FromRoute] string receiverId)
        {
            string senderId = _userManager.GetUserId(User);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            List<PrivateMessage> privateMessages = _privateMessagesManager.GetPrivateMessages(senderId, receiverId, chatSpaceId);
    
            List<PrivateMessageDto> privateMessageDtos = privateMessages.Select(pm => new PrivateMessageDto(pm)).ToList();

            return privateMessageDtos;
        }

        [Authorize]
        [HttpDelete]
        [Route("{messageId}")]
        public async Task<IActionResult> RemovePrivateMessage([FromRoute] long messageId)
        {
            string senderId = _userManager.GetUserId(User);
            PrivateMessage? privateMessage = await _privateMessagesManager.RemovePrivateMessage(messageId, senderId);

            if(privateMessage is null) {
                return NotFound();
            }

            
            List<ConnectionInformation> receiverConnectionInformation = privateMessage.Receiver.ConnectionInformations.ToList(); 
            List<string> connectionIds = receiverConnectionInformation.Select(ci => ci.ConnectionId).ToList();

            var removedMessageDto = new {
                Id = privateMessage.Id,
                Receiver = new {
                    Id = privateMessage.Receiver.Id,
                    UserName = privateMessage.Receiver.UserName,
                },
                Sender = new {
                    Id = privateMessage.Sender.Id,
                    UserName = privateMessage.Sender.UserName,
                },
                SentAt = privateMessage.SentAt,
                Body = privateMessage.Body,
            };

            await _hubContext.Clients.Clients(connectionIds).SendAsync("PrivateMessageRemoved", removedMessageDto);


            return NoContent();
        }

        [Authorize]
        [HttpPut]
        [Route("{messageId}")]
        public async Task<IActionResult> UpdatePrivateMessage([FromRoute] long messageId, [FromBody] UpdatePrivateMessageRequest updatePrivateMessageRequest)
        {
            string senderId = _userManager.GetUserId(User);
            PrivateMessage? messageToEdit = _dbContext.PrivateMessage
                .Include(pm => pm.Receiver)
                .ThenInclude(receiver => receiver.ConnectionInformations)
                .Include(pm => pm.Sender)
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

            var updateMessageDto = new {
                Id = messageToEdit.Id,
                Receiver = new {
                    Id = messageToEdit.Receiver.Id,
                    UserName = messageToEdit.Receiver.UserName,
                },
                Sender = new {
                    Id = messageToEdit.Sender.Id,
                    UserName = messageToEdit.Sender.UserName,
                },
                SentAt = messageToEdit.SentAt,
                Body = messageToEdit.Body,
                Edited = messageToEdit.Edited,
                Files = messageToEdit.PrivateMessageFiles.Select(pmf => new {
                    Id = pmf.Id,
                    Name = pmf.Name,
                })
            };

            await _hubContext.Clients.Clients(connectionIds).SendAsync("PrivateMessageUpdated", updateMessageDto);


            return NoContent();
        }
    }
} 