using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace pinger_api_service.Controllers;

[ApiController]
[Route("api/private-message-file")]
public class PrivateMesssageFileController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ApplicationUserManager _userManager;
    private readonly IFileManager _fileManager;

    public PrivateMesssageFileController(ApplicationDbContext dbContext, ApplicationUserManager userManager, IFileManager fileManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _fileManager = fileManager;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PrivateMessageFile>> Upload([FromForm] IFormFile file, [FromForm] string receiverId)
    {
        string userId = _userManager.GetUserId(User);
        User? receiver = await _userManager.FindByIdAsync(receiverId);
        User? sender = await _userManager.FindByIdAsync(userId);

        if(receiver is null) {
            return NotFound();
        }

        if(file.Length > 2000000) {
            return BadRequest(new { ErrorMessage = "File size cannot exceed 2MB" });
        }

        if(file.Length <= 0) {
            return BadRequest(new { ErrorMessage = "File size has to be larger that 0B" });
        }

        LocalFile createdFile = await _fileManager.AddFile(file, "data/private/", userId + "-" + receiverId);

        PrivateMessageFile privateMessageFile = new PrivateMessageFile{
            Name=createdFile.Name,
            Path=createdFile.Path,
            Owner = sender,
            Receiver = receiver,
            ContentType = createdFile.ContentType
        };

        await _dbContext.PrivateMessageFile.AddAsync(privateMessageFile);
        await _dbContext.SaveChangesAsync();

        return privateMessageFile;
    }

    [Authorize]
    [HttpGet]
    [Route("{fileId}")]
    public async Task<IActionResult> GetDocumentBytes([FromRoute] int fileId)
    {
        string userId = _userManager.GetUserId(User);
        PrivateMessageFile? privateMessageFile = await _dbContext.PrivateMessageFile
            .Include(pmf => pmf.Owner)
            .Include(pmf => pmf.Receiver)
            .Where(pmf => pmf.Owner.Id == userId || pmf.Receiver.Id == userId)
            .Where(pmf => pmf.Id == fileId)
            .FirstOrDefaultAsync();
    
        if(privateMessageFile is null) {
            return NotFound();
        }

        string filePath = Path.Combine(privateMessageFile.Path);

        if(!System.IO.File.Exists(filePath)) {
            return NotFound(); 
        }

        Response.Headers.Add("Content-Disposition", $"attachment;filename={privateMessageFile.Name}");

        byte[] byteArray = System.IO.File.ReadAllBytes(filePath);
        return new FileContentResult(byteArray, privateMessageFile.ContentType);
    }
}
