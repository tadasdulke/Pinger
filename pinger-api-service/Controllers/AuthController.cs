using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace pinger_api_service
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly ApplicationUserManager _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthenticateController(
            ApplicationUserManager userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            string? accessToken = Request.Cookies["X-Access-Token"];
            string? refreshToken = Request.Cookies["X-Refresh-Token"];

            if(accessToken is null || refreshToken is null) {
                return BadRequest();
            }

            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return BadRequest();
            }

            string userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest();
            }

            var newAccessToken = GetToken(principal.Claims.ToList());
            var newRefreshToken = GenerateRefreshToken();
            DateTime refreshTokenExpirityTime = DateTime.Now.AddDays(7);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = refreshTokenExpirityTime;
            await _userManager.UpdateAsync(user);

            CookieOptions jwtTokenCookieOptions = new CookieOptions{
                HttpOnly = true
            };

            Response.Cookies.Append(
                "X-Access-Token", 
                new JwtSecurityTokenHandler().WriteToken(newAccessToken), 
                jwtTokenCookieOptions
            );

            CookieOptions refreshTokenCookieOptions = new CookieOptions{
                Expires = refreshTokenExpirityTime,
                HttpOnly = true
            };

            Response.Cookies.Append(
                "X-Refresh-Token",
                refreshToken,
                refreshTokenCookieOptions
            );

            return Ok();
        }

        [HttpDelete]
        [Route("revoke-token")]
        public async Task<IActionResult> RevokeToken()
        {
            string? accessToken = Request.Cookies["X-Access-Token"];

            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return BadRequest();
            }

            string userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            User user = await _userManager.FindByIdAsync(userId);

            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);
            
            Response.Cookies.Delete("X-Refresh-Token");
            Response.Cookies.Delete("X-Access-Token");
    
            return NoContent();
        }
        
        [Microsoft.AspNetCore.Authorization.Authorize]
        [HttpPut]
        [Route("append-claims")]
        public async Task<IActionResult> AppendNewClaimsToToken(AppendNewClaim appendNewClaim)
        {
            string? accessToken = Request.Cookies["X-Access-Token"];

            if(accessToken is null) {
                return BadRequest();
            }

            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return BadRequest();
            }
            
            var claims = principal.Claims.ToList();
            claims = claims.Where(c => c.Type != CustomClaims.ChatSpaceId).ToList();
            claims.Add(new Claim(CustomClaims.ChatSpaceId, appendNewClaim.chatspaceId.ToString()));
            
            string userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return BadRequest();
            }

            var newAccessToken = GetToken(claims);

            CookieOptions jwtTokenCookieOptions = new CookieOptions{
                HttpOnly = true
            };

            Response.Cookies.Append(
                "X-Access-Token", 
                new JwtSecurityTokenHandler().WriteToken(newAccessToken), 
                jwtTokenCookieOptions
            );

            return NoContent();
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                List<Claim> authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

               var token = GetToken(authClaims);
               var refreshToken = GenerateRefreshToken();

               DateTime refreshTokenExpirityTime = DateTime.Now.AddDays(7);

               File? profilePicture = await _userManager.GetProfilePictureAsync(user.Id); 
               user.ProfileImageFile = profilePicture;

               user.RefreshToken = refreshToken;
               user.RefreshTokenExpiryTime = refreshTokenExpirityTime;
               await _userManager.UpdateAsync(user);

                CookieOptions jwtTokenCookieOptions = new CookieOptions{
                    HttpOnly = true,
                };

                Response.Cookies.Append(
                    "X-Access-Token", 
                    new JwtSecurityTokenHandler().WriteToken(token), 
                    jwtTokenCookieOptions
                );

                CookieOptions refreshTokenCookieOptions = new CookieOptions{
                    Expires = refreshTokenExpirityTime,
                    HttpOnly = true
                };

                Response.Cookies.Append(
                    "X-Refresh-Token",
                    refreshToken,
                    refreshTokenCookieOptions
                );

                return new UserDto(user);
            }

            return Unauthorized(new Error("Login failed. Check your credentials"));
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return BadRequest(new Error("User already exists!"));

            User user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(new Error("Register failed. Check username or password"));

            return Ok();
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(15),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }
    }
} 