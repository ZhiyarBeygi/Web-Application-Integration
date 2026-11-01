using Microsoft.AspNetCore.Mvc;
using TenderManagement.DTOs;
using TenderManagement.Services.Interfaces;

namespace TenderManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(
        CredentialsDto credentials)
    {
        var result = await _authService.Login(credentials);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(
        CredentialsDto credentials)
    {
        var userId = await _authService.Register(credentials);

        return Ok(new
        {
            UserId = userId
        });
    }
}