using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace pinger_api_service.Controllers;

[ApiController]
[Route("api/public-file")]
public class PublicFileContoller : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    public PublicFileContoller(ApplicationDbContext dbContext) {
        _dbContext = dbContext;
    }

    [Authorize]
    [HttpGet]
    [Route("{fileId}")]
    public async Task<IActionResult> GetDocumentBytes([FromRoute] int fileId)
    {
        File? file = _dbContext.File.Where(f => f.Discriminator == "File").Where(f => f.Id == fileId).FirstOrDefault();

        if(file is null) {
            return NotFound();
        }

        string filePath = Path.Combine(Environment.CurrentDirectory, file.Path);

        if(!System.IO.File.Exists(filePath)) {
            return NotFound(); 
        }

        byte[] byteArray = System.IO.File.ReadAllBytes(filePath);
        return new FileContentResult(byteArray, file.ContentType);
    }
}
