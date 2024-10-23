
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

        public static string UserIdentifierGamesSeparator { get => "#$#"; }
        public static string StartGameAction { get => "StartGame"; }
        public static TimeSpan WaitInMatchMaking { get => TimeSpan.FromSeconds(5); }
    }
}
