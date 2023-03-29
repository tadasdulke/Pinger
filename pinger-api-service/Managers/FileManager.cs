namespace pinger_api_service
{
    public class LocalFile
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public string ContentType { get; set; }
    }

    public interface IFileManager 
    {
        public Task<LocalFile> AddFile(IFormFile file, string directory, string fileDirectory);
        public void RemoveFile(string directoryPath);
    }

    public class FileManager : IFileManager
    {
        public async Task<LocalFile> AddFile(IFormFile file, string directory, string fileDirectory)
        {
            string fileName = file.FileName;
            string basePath = Path.Combine(directory, fileDirectory);
            string directoryPath = Path.Combine(Environment.CurrentDirectory, basePath);
            System.IO.Directory.CreateDirectory(directoryPath);


            Guid myuuid = Guid.NewGuid();
            string uniqueFileName = myuuid.ToString();
            var filePath = Path.Combine(basePath, uniqueFileName);

            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            return new LocalFile{
                Name = fileName,
                Path = filePath,
                ContentType = file.ContentType
            };
        }

        public void RemoveFile(string filePath) 
        {
            string fullFilePath = Path.Combine(Environment.CurrentDirectory, filePath);

            bool fileExists = System.IO.File.Exists(fullFilePath);

            if(fileExists) {
                System.IO.File.Delete(fullFilePath);
            }
        }
    }
}