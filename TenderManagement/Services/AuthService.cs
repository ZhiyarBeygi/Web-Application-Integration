using TenderManagement.DTOs;
using TenderManagement.Repositories.Interfaces;
using TenderManagement.Services.Interfaces;

namespace TenderManagement.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<LoginResponseDto> Login(CredentialsDto credentials)
    {
        var user = await _userRepository.GetByUsername(credentials.Username);

        if (user == null)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Invalid username or password."
            };
        }

        bool passwordCorrect = BCrypt.Net.BCrypt.Verify(
            credentials.Password,
            user.PasswordHash
        );

        if (!passwordCorrect)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Invalid username or password."
            };
        }

        return new LoginResponseDto
        {
            Success = true,
            Message = "Login successful.",
            UserId = user.Id,
            Username = user.Username
        };
    }

    public async Task<int> Register(CredentialsDto credentials)
    {
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(
            credentials.Password
        );

        return await _userRepository.Insert(
            credentials.Username,
            passwordHash
        );
    }
}