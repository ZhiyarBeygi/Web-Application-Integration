using TenderManagement.DTOs;

namespace TenderManagement.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> Login(CredentialsDto credentials);
    Task<int> Register(CredentialsDto credentials);
}