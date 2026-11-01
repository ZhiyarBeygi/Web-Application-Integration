namespace TenderManagement.DTOs;

public class ThemeUpdateDto
{
    public int UserId { get; set; }
    public string Theme { get; set; } = "light";
}