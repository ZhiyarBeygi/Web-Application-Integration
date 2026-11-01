using TenderManagement.DTOs;
using TenderManagement.Repositories.Interfaces;
using TenderManagement.Services.Interfaces;

namespace TenderManagement.Services;

public class TenderService : ITenderService
{
    private readonly ITenderRepository _repository;

    public TenderService(ITenderRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<TenderDto>> GetAll() => _repository.GetAll();
    public Task<TenderDto?> GetById(int id) => _repository.GetById(id);
    public Task<IEnumerable<TenderDto>> Search(string searchTerm) => _repository.Search(searchTerm);
    public Task<int> Create(TenderRequestDto tender) => _repository.Insert(tender);
    public Task<bool> Update(int id, TenderRequestDto tender) => _repository.Update(id, tender);
    public Task<bool> Delete(int id) => _repository.Delete(id);
}
