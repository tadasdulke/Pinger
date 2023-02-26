
using Microsoft.AspNetCore.Mvc;

namespace pinger_api_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        long size = file.Length;

        if (size > 0)
        {
            var filePath = Path.Combine("/app/data", file.FileName);
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
        }

        return Ok(new { fileName = file.FileName, size }); // Possible XSS vuln with filename. Fix this
    }
}
