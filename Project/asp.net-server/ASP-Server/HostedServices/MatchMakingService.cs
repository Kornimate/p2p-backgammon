using ASP_Server.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace ASP_Server.HostedServices
{
    public class MatchMakingService : IHostedService
    {
        private readonly ServerHub hub;

        public MatchMakingService(ServerHub hub)
        {
            this.hub = hub;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        private void PairPlayers()
        {
            
        }

        public void Dispose() { }
    }
}
