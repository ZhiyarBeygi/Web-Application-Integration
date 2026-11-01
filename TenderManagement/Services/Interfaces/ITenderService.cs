using TenderManagement.DTOs;

namespace TenderManagement.Services.Interfaces;

public interface ITenderService
{
    Task<IEnumerable<TenderDto>> GetAll();
    Task<TenderDto?> GetById(int id);
    Task<IEnumerable<TenderDto>> Search(string searchTerm);
    Task<int> Create(TenderRequestDto tender);
    Task<bool> Update(int id, TenderRequestDto tender);
    Task<bool> Delete(int id);
}
