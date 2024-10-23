
using ASP_Server.Hubs;
using ASP_Server.Models;
using ASP_Server.Services;
using Microsoft.EntityFrameworkCore;

namespace ASP_Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<ServerDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("SQLConnection"));
                options.UseLazyLoadingProxies();
            });

            builder.Services.AddDatabaseDeveloperPageExceptionFilter();

            builder.Services.AddSignalR();

            builder.Services.AddControllers();
            
            builder.Services.AddEndpointsApiExplorer();
            
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IServerService, ServerService>();

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapHub<ServerHub>("/matchMaking");

            app.Run();
        }
    }
}
