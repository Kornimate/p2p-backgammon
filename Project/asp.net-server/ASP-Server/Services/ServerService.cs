using ASP_Server.Models;

namespace ASP_Server.Services
{
    public class ServerService : IServerService
    {
        private readonly ServerDbContext context;

        public ServerService(ServerDbContext context)
        {
            this.context = context;
        }
    }
}
