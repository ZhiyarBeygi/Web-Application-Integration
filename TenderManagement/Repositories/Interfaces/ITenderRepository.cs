using TenderManagement.DTOs;

namespace TenderManagement.Repositories.Interfaces;

public interface ITenderRepository
{
    Task<IEnumerable<TenderDto>> GetAll();
    Task<TenderDto?> GetById(int id);
    Task<IEnumerable<TenderDto>> Search(string searchTerm);
    Task<int> Insert(TenderRequestDto tender);
    Task<bool> Update(int id, TenderRequestDto tender);
    Task<bool> Delete(int id);
}
