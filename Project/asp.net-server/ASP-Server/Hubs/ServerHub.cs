using ASP_Server.Constants;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ASP_Server.Hubs
{
    public class ServerHub : Hub
    {
        private readonly ConcurrentDictionary<string, string> usersInGroups;

        public ServerHub()
        {
            usersInGroups = new();
        }

        public override async Task OnConnectedAsync()
        {
            try
            {
                string group = ServerConstants.GetGroupForUser(Context.UserIdentifier);

                await Groups.AddToGroupAsync(Context.ConnectionId, group);

                usersInGroups.TryAdd(Context.ConnectionId, group);
            }
            catch (Exception) { }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            usersInGroups.TryRemove(Context.ConnectionId, out _);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendToAllAsync(string message)
        {
            await Clients.All.SendAsync("RecieveMessage", message);
        }

        public async Task SendToClientAsync(string connectionId, string message)
        {
            await Clients.Client(connectionId).SendAsync("RecieveMessage", message);
        }

        public async Task SendToGroupAsync(string groupName, string message)
        {
            await Clients.Group(groupName).SendAsync("RecieveMessage", message);
        }

        public async Task SendToGroupExceptCallerAsync(string groupName, List<string> excludedConnections, string message)
        {
            await Clients.GroupExcept(groupName, excludedConnections).SendAsync("RecieveMessage", message);
        }

        public bool TryGetTwoUsersFromGroup(string group, out string[] users)
        {
            users = [];

            var userDatas = usersInGroups.Where(x => x.Value == group).Take(2).ToArray();

            if (userDatas.Length < 2)
                return false;

            bool success = true;

            for (int i = 0; i < users.Length; i++)
            {
                success &= usersInGroups.TryRemove(users[i], out _);

                if (!success)
                {
                    for (int j = 0; j < i; j++)
                    {
                        var temp = userDatas[j];

                        usersInGroups.TryAdd(temp.Key, temp.Value);
                    }

                    return success;
                }
            }

            users = userDatas.Select(x => x.Key).ToArray();

            return success;
        }
    }
}
