namespace pinger_api_service
{
    public interface IConnectionInformationManager {
        public List<string> GetUsersConnectionInfo(List<User> users); 
    }

    public class ConnectionInformationManager : IConnectionInformationManager
    {
        public List<string> GetUsersConnectionInfo(List<User> users) 
        {
            return users.Aggregate(
                new List<string>(),
                (acc, member) => acc.Concat(member.ConnectionInformations.Select(ci => ci.ConnectionId)).ToList()
            );
        }
    }
}