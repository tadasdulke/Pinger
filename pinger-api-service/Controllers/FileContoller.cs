using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace pinger_api_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ApplicationUserManager _userManager;

    public FileController(ApplicationDbContext dbContext, ApplicationUserManager userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize]
    [Route("download-public/{filename}")]
    public async Task<IActionResult> DownloadPublic(string filename)
    {
        // var filePath = Path.Combine("/app/data/public", filename);

        // return PhysicalFile(filePath, "image/jpeg");
        throw new NotImplementedException();
    }

    [HttpPost]
    [Authorize]
    [Route("upload-public")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        long size = file.Length;

        if (size > 0)
        {
            var filePath = Path.Combine("/app/data/pubic", file.FileName);
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
        }

        return Ok(new { fileName = file.FileName, size }); // Possible XSS vuln with filename. Fix this
    }

    [Authorize]
    [HttpPost]
    [Route("upload-private")]
    public async Task<IActionResult> UploadPrivate(IFormFile file)
    {
        string userId = _userManager.GetUserId(User);
        
        long size = file.Length;

        if (size > 0)
        {
            var directoryPath = Path.Combine("/app/data/private", userId);
            System.IO.Directory.CreateDirectory(directoryPath);

            var filePath = Path.Combine(directoryPath, file.FileName);
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
        }

        return Ok(new { fileName = file.FileName, size }); // Possible XSS vuln with filename. Fix this
    }

    [Authorize]
    [HttpPost]
    [Route("remove-private")]
    public async Task<IActionResult> RemovePrivate([FromBody] DeleteFile deletedFile)
    {
        if(deletedFile.FileName.Trim() == String.Empty || deletedFile.FileName is null) {
            return BadRequest();
        }

        string userId = _userManager.GetUserId(User);
        string filePath = Path.Combine("/app/data/private", userId, deletedFile.FileName);
        
        if(System.IO.File.Exists(filePath)) {
            System.IO.File.Delete(filePath);
        } else {
            return NotFound();
        }

        return Ok(new { fileName = deletedFile.FileName }); // Possible XSS vuln with filename. Fix this
    }
}
