using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service.Controllers;

[ApiController]
[Route("api/channel-message-file")]
public class FileMessageFileController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ApplicationUserManager _userManager;
    private readonly IFileManager _fileManager;

    public FileMessageFileController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IFileManager fileManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _fileManager = fileManager;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ChannelMessageFileDto>> Upload([FromForm] IFormFile file, [FromForm] int channelId)
    {
        string userId = _userManager.GetUserId(User);
        User? owner = await _userManager.FindByIdAsync(userId);
        Channel? channel = await _dbContext.Channel.FirstOrDefaultAsync(c => c.Id == channelId);

        if(channel is null) {
            return NotFound();
        }

        if(file.Length > 2000000) {
            return BadRequest(new { ErrorMessage = "File size cannot exceed 2MB" });
        }
        
        if(file.Length <= 0) {
            return BadRequest(new { ErrorMessage = "File must be bigger that 0B" });
        }

        LocalFile createdLocalFile = await _fileManager.AddFile(file, "data/private/", channel.Id.ToString());

        ChannelMessageFile channelMessageFile = new ChannelMessageFile{
            Name=createdLocalFile.Name,
            Path=createdLocalFile.Path,
            Owner = owner,
            Channel = channel,
            ContentType = createdLocalFile.ContentType
        };

        await _dbContext.ChannelMessageFile.AddAsync(channelMessageFile);
        await _dbContext.SaveChangesAsync();

        return new ChannelMessageFileDto(channelMessageFile);
    }

    [Authorize]
    [HttpGet]
    [Route("{fileId}")]
    public async Task<IActionResult> GetDocument([FromRoute] int fileId)
    {
        string userId = _userManager.GetUserId(User);
        ChannelMessageFile? channelMessageFile = await _dbContext.ChannelMessageFile
            .Include(cmf => cmf.Owner)
            .Include(cmf => cmf.Channel)
            .ThenInclude(c => c.Members)
            .Where(pmf => pmf.Id == fileId)
            .FirstOrDefaultAsync();
    
        if(channelMessageFile is null) {
            return NotFound();
        }

        bool canAccess = channelMessageFile.Owner.Id == userId || channelMessageFile.Channel.Members.Any(m => m.Id == userId);

        if(!canAccess) {
            return Unauthorized();
        }

        string filePath = Path.Combine(channelMessageFile.Path);

        if(!System.IO.File.Exists(filePath)) {
            return NotFound(); 
        }

        Response.Headers.Add("Content-Disposition", $"attachment;filename={channelMessageFile.Name}");

        byte[] byteArray = System.IO.File.ReadAllBytes(filePath);
        return new FileContentResult(byteArray, channelMessageFile.ContentType);
    }
}
