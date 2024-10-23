namespace ASP_Server.Services
{
    public interface ISharedServerService
    {
        Task<bool> AddToCollectionAsync(string id, int gameNum);
        Task<bool> RemoveFromCollectionAsync(string id);
        Task<(bool, string[]?)> TryGetTwoUsersFromGroupAsync(string group);
    }
}
