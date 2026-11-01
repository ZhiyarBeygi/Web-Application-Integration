namespace TenderManagement.DTOs;

public class UserSettingsDto
{
    public int UserId { get; set; }
    public string Theme { get; set; } = "light";
    public List<string> BookmarkedItems { get; set; } = new();
}