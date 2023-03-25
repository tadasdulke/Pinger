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

    public PrivateMesssageFileController(ApplicationDbContext dbContext, ApplicationUserManager userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
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

        long size = file.Length;
        string fileName = file.FileName;
        
        if(size > 2000000) {
            return BadRequest();
        }

        string basePath = Path.Combine("data/private/", userId + "-" + receiverId);
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

        PrivateMessageFile privateMessageFile = new PrivateMessageFile{
            Name=fileName,
            Path=filePath,
            Owner = sender,
            Receiver = receiver,
            ContentType = file.ContentType
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
