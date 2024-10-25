using ASP_Server.Models;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ASP_Server.Constants;

namespace ASP_Server.Services
{
    public static class ServerStartUpService
    {
        public static void HandleStartUp(IServiceProvider serviceProvider)
        {
            using var dbContext = serviceProvider.GetRequiredService<ServerDbContext>();
            IConfiguration config = serviceProvider.GetRequiredService<IConfiguration>();
            UserManager<IdentityUser> userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

            dbContext.Database.Migrate();

            if (!dbContext.Users.Any())
                userManager.CreateAsync(new IdentityUser(config["Admin:UserName"]!) { Email = config["Admin:Email"] }, config["Admin:Password"]!).Wait();
        }
    }
}
