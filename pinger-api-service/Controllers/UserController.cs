using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private ApplicationDbContext _dbContext;
        private readonly UserManager<User> _userManager;

        public UserController(ApplicationDbContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        [Route("contacted-users")]
        public async Task<ActionResult<List<User>>> GetContactedUsers()
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.ContactedUsers).FirstOrDefaultAsync(u => u.Id == userId);

            if(user is null) {
                return NotFound();
            }

            List<User> contactedUsers = user.ContactedUsers.ToList();

            return contactedUsers;

        }

        [Authorize]
        [HttpPost]
        [Route("contacted-users")]
        public async Task<IActionResult> AddContactedUser([FromBody] AddContactedUser contactedUserRequest)
        {
            string userId = _userManager.GetUserId(User);
            User? user = await _dbContext.Users.Include(u => u.ContactedUsers).FirstOrDefaultAsync(u => u.Id == userId);

            if(user is null) {
                return NotFound();
            }
            
            string contactedUserId = contactedUserRequest.contactedUserId;
            User? contactedUser = await _userManager.FindByIdAsync(contactedUserId);
            
            if(contactedUser is null) {
                return NotFound();
            }
            
            List<User> contactedUsers = user.ContactedUsers.ToList();
            contactedUsers.Add(contactedUser);
            user.ContactedUsers = contactedUsers;
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
} 