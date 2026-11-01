using TenderManagement.DTOs;

namespace TenderManagement.Repositories.Interfaces;

public interface IUserRepository
{
    Task<UserDto?> GetByUsername (string username);
    Task<int> Insert(string username, string passwordHash);
}