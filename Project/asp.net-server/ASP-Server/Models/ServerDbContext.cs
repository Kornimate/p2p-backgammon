using Microsoft.EntityFrameworkCore;

namespace ASP_Server.Models
{
    public class ServerDbContext : DbContext
    {
        public ServerDbContext(DbContextOptions<ServerDbContext> options) : base(options) { }
    }
}
