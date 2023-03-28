
namespace pinger_api_service
{
    public class PrivateMessageFileDto
    {
        public PrivateMessageFileDto(PrivateMessageFile privateMessageFile) {
            this.Id = privateMessageFile.Id;
            this.Name = privateMessageFile.Name;
        }
        
        public int Id { get; set; }
        public string Name { get; set; }
    }
}