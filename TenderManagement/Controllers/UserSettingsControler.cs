using Microsoft.AspNetCore.Mvc;
using TenderManagement.DTOs;
using TenderManagement.Services.Interfaces;

namespace TenderManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserSettingsController : ControllerBase
{
    private readonly IUserSettingsService _userSettingsService;

    public UserSettingsController(IUserSettingsService userSettingsService)
    {
        _userSettingsService = userSettingsService;
    }

    [HttpGet("{userId:int}")]
    public async Task<IActionResult> Get(int userId)
    {
        var settings = await _userSettingsService.Get(userId);
        return Ok(settings);
    }

    [HttpPut("theme")]
    public async Task<IActionResult> SetTheme([FromBody] ThemeUpdateDto request)
    {
        var settings = await _userSettingsService.SetTheme(request.UserId, request.Theme);
        return Ok(settings);
    }

    [HttpPost("bookmarks")]
    public async Task<IActionResult> AddBookmark([FromBody] BookmarkActionDto request)
    {
        if (string.IsNullOrEmpty(request.ItemPath))
        {
            return BadRequest("ItemPath is required.");
        }

        var settings = await _userSettingsService.AddBookmark(request.UserId, request.ItemPath);
        return Ok(settings);
    }

    [HttpDelete("bookmarks")]
    public async Task<IActionResult> RemoveBookmark([FromBody] BookmarkActionDto request)
    {
        if (string.IsNullOrEmpty(request.ItemPath))
        {
            return BadRequest("ItemPath is required.");
        }

        var settings = await _userSettingsService.RemoveBookmark(request.UserId, request.ItemPath);
        return Ok(settings);
    }
}