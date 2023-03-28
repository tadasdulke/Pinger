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

    public FileMessageFileController(ApplicationDbContext dbContext, ApplicationUserManager userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ChannelMessageFile>> Upload([FromForm] IFormFile file, [FromForm] int channelId)
    {
        string userId = _userManager.GetUserId(User);
        User? owner = await _userManager.FindByIdAsync(userId);
        Channel? channel = await _dbContext.Channel.FirstOrDefaultAsync(c => c.Id == channelId);

        if(channel is null) {
            return NotFound();
        }

        long size = file.Length;
        string fileName = file.FileName;
        
        if(size > 2000000) {
            return BadRequest(new { ErrorMessage = "File size cannot exceed 2MB" });
        }

        string basePath = Path.Combine("data/private/", channelId.ToString());
        string directoryPath = Path.Combine(Environment.CurrentDirectory, basePath);
        System.IO.Directory.CreateDirectory(directoryPath);


        Guid myuuid = Guid.NewGuid();
        string uniqueFileName = myuuid.ToString();
        var filePath = Path.Combine(basePath, uniqueFileName);

        if (size >= 0)
        {
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
        }

        ChannelMessageFile channelMessageFile = new ChannelMessageFile{
            Name=fileName,
            Path=filePath,
            Owner = owner,
            Channel = channel,
            ContentType = file.ContentType
        };

        await _dbContext.ChannelMessageFile.AddAsync(channelMessageFile);
        await _dbContext.SaveChangesAsync();

        return channelMessageFile;
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
