using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using TenderManagement.DTOs;
using TenderManagement.Repositories.Interfaces;

namespace TenderManagement.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SqlConnection _connection;

    public UserRepository(SqlConnection connection)
    {
        _connection = connection;
    }
    
    public async Task<UserDto?> GetByUsername(string username)
    {
        return await _connection.QueryFirstOrDefaultAsync<UserDto>(
            "User_GetByUsername",
            new { Username = username },
            commandType: CommandType.StoredProcedure
        );
    }
    public async Task<int> Insert(string username, string passwordHash)
    {
        return await _connection.ExecuteScalarAsync<int>(
            "User_Insert",
            new
            {
                Username = username,
                PasswordHash = passwordHash
            },
            commandType: CommandType.StoredProcedure
        );
    }
}