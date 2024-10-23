using ASP_Server.Constants;
using ASP_Server.Services;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ASP_Server.Hubs
{
    public class ServerHub : Hub
    {
        private readonly ISharedServerService sharedService;

        public ServerHub(ISharedServerService sharedService)
        {
            this.sharedService = sharedService;
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("GetId",Context.ConnectionId);

            Console.WriteLine($"connected: {Context.ConnectionId}");

            await base.OnConnectedAsync();
        }

        public async Task PublishUserData(string userData)
        {
            try
            {
                Console.WriteLine($"recieved user data: {userData}");

                string[] userIdAndGames = userData.Split(ServerConstants.UserIdentifierGamesSeparator);

                await sharedService.AddToCollectionAsync(userIdAndGames[0], int.Parse(userIdAndGames[1]));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            try
            {
                await sharedService.RemoveFromCollectionAsync(Context.ConnectionId);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            Console.WriteLine($"disonnected: {Context.ConnectionId}");

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendAsync(string message)
        {
            await Clients.All.SendAsync("RecieveMessage", message);
        }

        public async Task SendToClientAsync(string connectionId, string message)
        {
            await Clients.Client(connectionId).SendAsync("RecieveMessage", message);
        }
    }
}
