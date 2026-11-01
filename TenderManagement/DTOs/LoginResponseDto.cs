namespace TenderManagement.DTOs;

public class LoginResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public int? UserId { get; set; }
    public string? Username { get; set; }
}