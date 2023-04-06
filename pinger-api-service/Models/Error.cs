namespace pinger_api_service
{
    public class Error
    {
        public Error(string message) {
            this.Message = message;
        }

        public string Message { get; set; }
    }
}