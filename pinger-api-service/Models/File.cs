using System.ComponentModel.DataAnnotations;

namespace pinger_api_service
{
    public class File
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string ContentType { get; set; }
        public User Owner { get; set; }
    }
}