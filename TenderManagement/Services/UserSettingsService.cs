using TenderManagement.DTOs;
using TenderManagement.Repositories.Interfaces;
using TenderManagement.Services.Interfaces;

namespace TenderManagement.Services;

public class UserSettingsService : IUserSettingsService
{
    private readonly IUserSettingsRepository _userSettingsRepository;

    public UserSettingsService(IUserSettingsRepository userSettingsRepository)
    {
        _userSettingsRepository = userSettingsRepository;
    }

    public Task<UserSettingsDto> Get(int userId) =>
        _userSettingsRepository.Get(userId);

    public Task<UserSettingsDto> SetTheme(int userId, string theme) =>
        _userSettingsRepository.SetTheme(userId, theme);

    public Task<UserSettingsDto> AddBookmark(int userId, string itemPath) =>
        _userSettingsRepository.AddBookmark(userId, itemPath);

    public Task<UserSettingsDto> RemoveBookmark(int userId, string itemPath) =>
        _userSettingsRepository.RemoveBookmark(userId, itemPath);
}