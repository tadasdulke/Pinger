using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;

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

    // [Authorize]
    // [HttpPost]
    // [Route("upload-private")]
    // public async Task<ActionResult<File>> UploadPrivate(IFormFile file)
    // {
    //     string userId = _userManager.GetUserId(User);
    //     long size = file.Length;
    //     string fileName = file.FileName;
        
    //     if(size > 2000000) {
    //         return BadRequest();
    //     }

    //     string directoryPath = Path.Combine(Environment.CurrentDirectory, "data/private/", userId);
    //     System.IO.Directory.CreateDirectory(directoryPath);

    //     var filePath = Path.Combine(directoryPath, fileName);

    //     if (size >= 0)
    //     {
    //         using (var stream = System.IO.File.Create(filePath))
    //         {
    //             await file.CopyToAsync(stream);
    //         }
    //     }

    //     File newFile = new File{
    //         Path = Path.Combine("data/private", userId, filePath)
    //     };

    //     await _dbContext.File.AddAsync(newFile);
    //     await _dbContext.SaveChangesAsync();

    //     return newFile;
    // }

    [Authorize]
    [HttpGet]
    [Route("private-file/{fileName}")]
    public IActionResult GetDocumentBytes(string fileName)
    {
        string filePath = Path.Combine(Environment.CurrentDirectory, "data/private", fileName);

        if(!System.IO.File.Exists(filePath)) {
            return NotFound(); 
        }

        byte[] byteArray = System.IO.File.ReadAllBytes(filePath);
        return new FileContentResult(byteArray, "application/pdf");
    }

    [Authorize]
    [HttpDelete]
    [Route("private-file/{fileName}")]
    public async Task<IActionResult> RemovePrivate([FromRoute] string fileName)
    {
        if(fileName.Trim() == String.Empty || fileName is null) {
            return BadRequest();
        }

        string userId = _userManager.GetUserId(User);
        string filePath = Path.Combine(Environment.CurrentDirectory, "data/private", userId, fileName);
        var fileExists = System.IO.File.Exists(filePath);
        
        if(fileExists) {
            System.IO.File.Delete(filePath);
        } else {
            return NotFound();
        }

        return Ok(new { fileName = fileName });
    }
}
