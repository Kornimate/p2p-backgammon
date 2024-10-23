using ASP_Server.Constants;
using System.Collections.Concurrent;

namespace ASP_Server.Services
{
    public class SharedServerService : ISharedServerService
    {
        private readonly ConcurrentDictionary<string, string> usersInGroups;

        public SharedServerService()
        {
            usersInGroups = new();
        }

        public async Task<bool> AddToCollectionAsync(string id, int gameNum)
        {
            bool res = usersInGroups.TryAdd(id, GetGroupForUser(gameNum));

            WriteCollectionToConsole($"user added to collection: {id} {{{res}}}");

            return await Task.FromResult(res);
        }

        public async Task<bool> RemoveFromCollectionAsync(string id)
        {
            bool res = usersInGroups.TryRemove(id, out _);

            WriteCollectionToConsole($"user removed from collection: {id} {{{res}}}");

            return await Task.FromResult(res);
        }

        public async Task<(bool, string[]?)> TryGetTwoUsersFromGroupAsync(string group)
        {
            string[] users = new string[2];

            var userDatas = usersInGroups.Where(x => x.Value == group).Take(2).ToArray();

            if (userDatas.Length < 2)
                return (false, null);

            bool success = true;

            for (int i = 0; i < userDatas.Length; i++)
            {
                success &= usersInGroups.TryGetValue(userDatas[i].Key, out var userData);

                users[i] = userDatas[i].Key;
            }

            return await Task.FromResult((success, users));
        }

        private void WriteCollectionToConsole(string startText)
        {
            Console.WriteLine(startText);
            Console.WriteLine("-------------------");

            foreach (var user in usersInGroups)
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
