using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace PingerChatHub
{
    public class RequestDiagnosticsMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestDiagnosticsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            Console.WriteLine(context.Request.Path);
            Console.WriteLine(context.Request.Headers["Origin"]);
            await _next(context);
        }
    }
}