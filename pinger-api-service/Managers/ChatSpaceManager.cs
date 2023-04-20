using Microsoft.EntityFrameworkCore;

namespace pinger_api_service
{
    public class ChatSpaceManager : IChatSpaceManager
    {
        private readonly ApplicationDbContext _dbContext;

        public ChatSpaceManager(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ChatSpace?> GetChatSpaceById(int id)
        {
            ChatSpace? chatspace = await _dbContext.ChatSpace
                .Include(cs => cs.Owner)
                .Include(cs => cs.Channel)
                .Include(cs => cs.Members)
                .ThenInclude(u => u.ProfileImageFile)
                .Include(cs => cs.Members)
                .ThenInclude(m => m.ConnectionInformations)
                .FirstOrDefaultAsync(chatspace => chatspace.Id == id);
            return chatspace;
        }

        public async Task AddUserToChatspace(ChatSpace chatspace, User userToAdd)
        {
            chatspace.Members.Add(userToAdd);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<ChatSpace>> GetUsersChatSpaces(string userId) {
           List<ChatSpace> chatSpaces = await _dbContext.ChatSpace
            .Include(x => x.Members)
            .Where(x => x.Members.Any(m => m.Id == userId)).ToListAsync();

            return chatSpaces;
        }

        public async Task<List<User>?> GetChatSpaceMembers(int chatspaceId) {
            ChatSpace? chatSpace = await _dbContext.ChatSpace
                .Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == chatspaceId);

            if(chatSpace is null) {
                return null;
            }

            return chatSpace.Members.ToList();
        }

        public async Task UpdateChatSpace(string name, ChatSpace chatSpace) {
            ChatSpace chatSpaceCopy = chatSpace;
            chatSpaceCopy.Name = name;

            await _dbContext.SaveChangesAsync();
        }

        public async Task RemoveMember(User member, ChatSpace chatSpace) {
            chatSpace.Members.Remove(member);
            await _dbContext.SaveChangesAsync();
        }
    }
}