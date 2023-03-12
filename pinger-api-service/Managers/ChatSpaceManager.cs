namespace pinger_api_service
{
    public class ChatSpaceManager : IChatSpaceManager
    {
        private readonly ApplicationDbContext _dbContext;

        public ChatSpaceManager(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public ChatSpace? GetChatSpaceById(int id)
        {
            ChatSpace? chatspace = _dbContext.ChatSpace.FirstOrDefault(chatspace => chatspace.Id == id);
            return chatspace;
        }
    }
}