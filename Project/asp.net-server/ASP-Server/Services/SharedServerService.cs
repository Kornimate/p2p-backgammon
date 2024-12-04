using ASP_Server.Constants;
using System.Collections.Concurrent;

namespace ASP_Server.Services
{
    public class SharedServerService : ISharedServerService
    {
        private readonly ConcurrentDictionary<string, string> usersInGroups;
        private readonly Dictionary<string, string> aloneUsers;

        public SharedServerService()
        {
            usersInGroups = new();
            aloneUsers = new();
        }

        public async Task<bool> AddToCollectionAsync(string id, int gameNum)
        {
            bool res = usersInGroups.TryAdd(id, GetGroupForUser(gameNum));
            WriteCollectionToConsole($"user added to collection: {id} {{{res}}}", usersInGroups);

            return await Task.FromResult(res);
        }

        public async Task<bool> RemoveFromCollectionAsync(string id)
        {
            bool res = usersInGroups.TryRemove(id, out _);

            WriteCollectionToConsole($"user removed from collection: {id} {{{res}}}", usersInGroups);

            lock (aloneUsers)
            {
                res = aloneUsers.Remove(id);
            }

            WriteCollectionToConsole($"user removed from alones: {id} {{{res}}}", usersInGroups);

            return await Task.FromResult(res);
        }

        public async Task<(bool, string[]?)> TryGetTwoUsersFromGroupAsync(string group)
        {
            string[] users = new string[2];

            var userDatas = usersInGroups.Where(x => x.Value == group).Take(2).ToArray();

            if (userDatas.Length < 1)
            {
                return (false, null);
            }

            bool success = true;

            if (userDatas.Length < 2)
            {
                usersInGroups.TryRemove(userDatas[0].Key, out var _);
                WriteCollectionToConsole("removed:", usersInGroups);
                return (false, [userDatas[0].Key, userDatas[0].Value]);
            }

            for (int i = 0; i < userDatas.Length; i++)
            {
                success &= usersInGroups.TryRemove(userDatas[i].Key, out var userData);

                users[i] = userDatas[i].Key;
            }

            return await Task.FromResult((success, users));
        }

        public Task AddUserToRemainder(string[] userData)
        {
            lock (aloneUsers)
            {
                aloneUsers.Add(userData[0], userData[1]);
            }

            WriteCollectionToConsole($"alone users, user added", aloneUsers);

            return Task.CompletedTask;
        }

        public Task<List<(string, string)>> MakePairsFromRemainder()
        {
            var pairBase = new List<KeyValuePair<string, string>>();

            lock (aloneUsers)
            {
                if (aloneUsers.Count < 2)
                    return Task.FromResult<List<(string, string)>>([]);

                if (aloneUsers.Count % 2 == 0)
                {
                    pairBase = [.. aloneUsers.OrderBy(x => x.Value)];
                    aloneUsers.Clear();
                }
                else
                {
                    pairBase = [.. aloneUsers.OrderBy(x => x.Value)];
                    var last = pairBase[^1];
                    aloneUsers.Clear();
                    aloneUsers.Add(last.Key, last.Value);

                }

                WriteCollectionToConsole("alone users ", aloneUsers);
            }


            List<(string, string)> pairs = [];

            for (int i = 0; i < pairBase.Count; i += 2)
            {
                pairs.Add((pairBase[i].Key, pairBase[i + 1].Key));
            }

            return Task.FromResult(pairs);
        }

        private void WriteCollectionToConsole(string startText, IDictionary<string, string> collection)
        {
            Console.WriteLine(startText);
            Console.WriteLine("-------------------");

            foreach (var user in collection)
            {
                Console.WriteLine($"{user.Key} : {user.Value}");
            }

            Console.WriteLine("-------------------\n");
        }

        private static string GetGroupForUser(int gameNum)
        {
            foreach (var groupData in ServerConstants.GroupNames)
            {
                if (gameNum < groupData.Item2)
                {
                    return groupData.Item1;
                }
            }

            return ServerConstants.GroupNames.Last().Item1;
        }
    }
}
