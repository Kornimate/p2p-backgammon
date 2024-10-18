using Microsoft.AspNetCore.SignalR;

namespace ASP_Server.Hubs
{
    public class ServerHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendToAllAsync(string message)
        {
            await Clients.All.SendAsync("RecieveMessage",message);
        }

        public async Task SendToClientAsync(string connectionId, string message)
        {
            await Clients.Client(connectionId).SendAsync("RecieveMessage", message);
        }

        public async Task SendToGroupAsync(string groupName, string message)
        {
            await Clients.Group(groupName).SendAsync("RecieveMessage", message);
        }
        
        public async Task SendToGroupExceptCallerAsync(string groupName,List<string> excludedConnections, string message)
        {
            await Clients.GroupExcept(groupName,excludedConnections).SendAsync("RecieveMessage", message);
        }
    }
}
