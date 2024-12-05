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
                foreach (var pair in await sharedService.MakePairsFromRemainder())
                {
                    var isBlack = ServerConstants.DecideIfPlayerIsBlack();
                    await hubContext.Clients.Client(ServerConstants.GetPlayerSignalRId(pair.Item1)).SendAsync(ServerConstants.StartGameAction, ServerConstants.GetPlayerPeerIdAndNameAndColor(pair.Item2, isBlack), cancellationToken);
                    await hubContext.Clients.Client(ServerConstants.GetPlayerSignalRId(pair.Item2)).SendAsync(ServerConstants.StartGameAction, ServerConstants.GetPlayerPeerIdAndNameAndColor(pair.Item1, !isBlack), cancellationToken);
                }

                foreach (var group in ServerConstants.GroupNames)
                {
                    try
                    {
                        var playersQuery = await sharedService.TryGetTwoUsersFromGroupAsync(group.Item1);

                        if (playersQuery.Item1)
                        {
                            var isBlack = ServerConstants.DecideIfPlayerIsBlack();
                            await hubContext.Clients.Client(ServerConstants.GetPlayerSignalRId(playersQuery.Item2![0])).SendAsync(ServerConstants.StartGameAction, ServerConstants.GetPlayerPeerIdAndNameAndColor(playersQuery.Item2[1], isBlack), cancellationToken);
                            await hubContext.Clients.Client(ServerConstants.GetPlayerSignalRId(playersQuery.Item2![1])).SendAsync(ServerConstants.StartGameAction, ServerConstants.GetPlayerPeerIdAndNameAndColor(playersQuery.Item2[0], !isBlack), cancellationToken);
                        }
                        else if(playersQuery.Item2 is not null)
                        {
                            await sharedService.AddUserToRemainder(playersQuery.Item2);
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
