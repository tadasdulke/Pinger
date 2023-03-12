using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        public PrivateMessagesController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IPrivateMessagesManager privateMessagesManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _privateMessagesManager = privateMessagesManager;
        }

        [Authorize]
        [HttpGet]
        [Route("{receiverId}")]
        public ActionResult<List<PrivateMessage>> GetPrivateMessages([FromRoute] string receiverId)
        {
            string senderId = _userManager.GetUserId(User);
            int chatSpaceId = _userManager.GetChatSpaceId(User);
            List<PrivateMessage> privateMessages = _privateMessagesManager.GetPrivateMessages(senderId, receiverId, chatSpaceId);
            
            return privateMessages;
        }
    }
} 