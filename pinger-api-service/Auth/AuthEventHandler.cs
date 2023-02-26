
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace pinger_api_service
{
public class AuthEventsHandler : JwtBearerEvents
{

    private AuthEventsHandler() => OnMessageReceived = MessageReceivedHandler;

    public static AuthEventsHandler Instance { get; } = new AuthEventsHandler();

    private Task MessageReceivedHandler(MessageReceivedContext context)
    {
        if (context.Request.Cookies.ContainsKey("X-Access-Token"))
        {
            string token = context.Request.Cookies["X-Access-Token"];

            context.Token =  token;
        } else {
            context.NoResult();
        }

        return Task.CompletedTask;
    }
}
}