using System.Data;
using System.Text.Json;
using Dapper;
using Microsoft.Data.SqlClient;
using TenderManagement.DTOs;
using TenderManagement.Repositories.Interfaces;

namespace TenderManagement.Repositories;

public class UserSettingsRepository : IUserSettingsRepository
{
    private readonly string _connectionString;

    public UserSettingsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

    public async Task<UserSettingsDto> Get(int userId)
    {
        using var connection = CreateConnection();

        await connection.ExecuteAsync(
            "UserSettings_EnsureExists",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );

        var row = await connection.QueryFirstOrDefaultAsync(
            "UserSettings_Get",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );

        string theme = row?.Theme ?? "light";
        string? bookmarksJson = row?.BookmarkedItems;

        var bookmarks = string.IsNullOrEmpty(bookmarksJson)
            ? new List<string>()
            : JsonSerializer.Deserialize<List<string>>(bookmarksJson) ?? new List<string>();

        return new UserSettingsDto
        {
            UserId = userId,
            Theme = theme,
            BookmarkedItems = bookmarks,
        };
    }

    public async Task<UserSettingsDto> SetTheme(int userId, string theme)
    {
        using var connection = CreateConnection();

        await connection.ExecuteAsync(
            "UserSettings_EnsureExists",
            new { UserId = userId },
            commandType: CommandType.StoredProcedure
        );

        await connection.ExecuteAsync(
            "UserSettings_SetTheme",
            new { UserId = userId, Theme = theme },
            commandType: CommandType.StoredProcedure
        );

        return await Get(userId);
    }

    public async Task<UserSettingsDto> AddBookmark(int userId, string itemPath)
    {
        var current = await Get(userId);

        if (!current.BookmarkedItems.Contains(itemPath))
        {
            current.BookmarkedItems.Add(itemPath);
            await SaveBookmarks(userId, current.BookmarkedItems);
        }

        return current;
    }

    public async Task<UserSettingsDto> RemoveBookmark(int userId, string itemPath)
    {
        var current = await Get(userId);

        if (current.BookmarkedItems.Remove(itemPath))
        {
            await SaveBookmarks(userId, current.BookmarkedItems);
        }

        return current;
    }

    private async Task SaveBookmarks(int userId, List<string> items)
    {
        using var connection = CreateConnection();

        var json = JsonSerializer.Serialize(items);

        await connection.ExecuteAsync(
            "UserSettings_SetBookmarks",
            new { UserId = userId, BookmarkedItems = json },
            commandType: CommandType.StoredProcedure
        );
    }
}