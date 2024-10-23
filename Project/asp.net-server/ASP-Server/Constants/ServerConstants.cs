
namespace ASP_Server.Constants
{
    public static class ServerConstants
    {
        public static IReadOnlyCollection<(string, int)> GroupNames
        {
            get
            {
                return
                    [
                        ("Starter",10),
                    ("Beginner",30),
                    ("Intermediate",50),
                    ("Pro", 70),
                    ("Expert",100),
                    ("Legend",int.MaxValue)
                    ];
            }
        }

        public static string UserIdentifierGamesSeparator { get => "?"; }

        public static string GetGroupForUser(string? userIdentifier)
        {
            int games = int.Parse(userIdentifier?.Split(UserIdentifierGamesSeparator)[1] ?? throw new Exception("invalid request"));

            foreach (var groupData in GroupNames)
            {
                if (games < groupData.Item2)
                {
                    return groupData.Item1;
                }
            }

            return ServerConstants.GroupNames.Last().Item1;
        }
    }
}
