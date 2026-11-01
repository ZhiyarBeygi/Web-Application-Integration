using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using TenderManagement.DTOs;
using TenderManagement.Repositories.Interfaces;

namespace TenderManagement.Repositories;

public class TenderRepository : ITenderRepository
{
    private readonly SqlConnection _connection;

    public TenderRepository(SqlConnection connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<TenderDto>> GetAll() =>
        await _connection.QueryAsync<TenderDto>("Tender_GetAll", commandType: CommandType.StoredProcedure);

    public async Task<TenderDto?> GetById(int id) =>
        await _connection.QueryFirstOrDefaultAsync<TenderDto>(
            "Tender_GetById", new { Id = id }, commandType: CommandType.StoredProcedure);

    public async Task<IEnumerable<TenderDto>> Search(string searchTerm) =>
        await _connection.QueryAsync<TenderDto>(
            "Tender_Search", new { SearchTerm = searchTerm }, commandType: CommandType.StoredProcedure);

    public async Task<int> Insert(TenderRequestDto tender) =>
        await _connection.ExecuteScalarAsync<int>(
            "Tender_Insert", tender, commandType: CommandType.StoredProcedure);

public async Task<bool> Update(int id, TenderRequestDto tender)
{
    var parameters = new DynamicParameters(tender);
    parameters.Add("Id", id);

    var rowsAffected = await _connection.QuerySingleAsync<int>(
        "Tender_Update",
        parameters,
        commandType: CommandType.StoredProcedure);

    return rowsAffected > 0;
}

public async Task<bool> Delete(int id)
{
    var rowsAffected = await _connection.QuerySingleAsync<int>(
        "Tender_Delete",
        new { Id = id },
        commandType: CommandType.StoredProcedure);

    return rowsAffected > 0;
}
}
