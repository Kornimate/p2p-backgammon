using ASP_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ASP_Server.Services
{
    public static class ServerStartUpService
    {
        public static void HandleStartUp(IServiceProvider serviceProvider)
        {
            using var dbContext = serviceProvider.GetRequiredService<ServerDbContext>();

            dbContext.Database.Migrate();
        }
    }
}
