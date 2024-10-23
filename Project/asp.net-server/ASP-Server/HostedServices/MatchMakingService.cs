using ASP_Server.Constants;
using ASP_Server.Hubs;
using ASP_Server.Services;
using Microsoft.AspNetCore.SignalR;

namespace ASP_Server.HostedServices
{
    public class MatchMakingService : BackgroundService
    {
        private readonly IHubContext<ServerHub> hubContext;
        private readonly ISharedServerService sharedService;

        public MatchMakingService(IHubContext<ServerHub> hubContext, ISharedServerService sharedService)
        {
            this.hubContext = hubContext;
            this.sharedService = sharedService;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("background service started");

            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("background service finished");

            return base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("match making round started");

            while (!cancellationToken.IsCancellationRequested)
            {
                foreach (var group in ServerConstants.GroupNames)
                {
                    try
                    {
                        var playersQuery = sharedService.TryGetTwoUsersFromGroupAsync(group.Item1).GetAwaiter().GetResult();

                        if (playersQuery.Item1)
                        {
                            await hubContext.Clients.Client(playersQuery.Item2![0]).SendAsync(ServerConstants.StartGameAction, playersQuery.Item2[1], cancellationToken);
                            await hubContext.Clients.Client(playersQuery.Item2![1]).SendAsync(ServerConstants.StartGameAction, playersQuery.Item2[0], cancellationToken);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }

                await Task.Delay(ServerConstants.WaitInMatchMaking, cancellationToken);
            }

            Console.WriteLine("match making round finished");
        }

        public override void Dispose()
        {
            base.Dispose();
        }
    }
}
