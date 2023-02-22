using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatSpacesController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public ChatSpacesController(
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> AddChatSpace()
        {
            return Ok(new
                {
                    test = User.FindFirstValue("Id")
                });

            // var user = await _userManager.FindByNameAsync(model.Username);
            // if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            // {
            //     var userRoles = await _userManager.GetRolesAsync(user);

            //     var authClaims = new List<Claim>
            //     {
            //         new Claim(ClaimTypes.Name, user.UserName),
            //         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            //     };

            //     foreach (var userRole in userRoles)
            //     {
            //         authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            //     }

            //     return Ok(new
            //     {
            //         token = new JwtSecurityTokenHandler().WriteToken(token),
            //         expiration = token.ValidTo
            //     });
            // }
            // return Unauthorized();
        }
    }
} 