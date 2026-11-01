using TenderManagement.DTOs;

namespace TenderManagement.Services.Interfaces;

public interface IUserSettingsService
{
    Task<UserSettingsDto> Get(int userId);
    Task<UserSettingsDto> SetTheme(int userId, string theme);
    Task<UserSettingsDto> AddBookmark(int userId, string itemPath);
    Task<UserSettingsDto> RemoveBookmark(int userId, string itemPath);
}