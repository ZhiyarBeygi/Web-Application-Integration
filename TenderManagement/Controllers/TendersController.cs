using Microsoft.AspNetCore.Mvc;
using TenderManagement.DTOs;
using TenderManagement.Services.Interfaces;

namespace TenderManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TendersController : ControllerBase
{
    private readonly ITenderService _service;

    public TendersController(ITenderService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TenderDto>>> GetAll() => Ok(await _service.GetAll());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TenderDto>> GetById(int id)
    {
        var tender = await _service.GetById(id);
        return tender is null ? NotFound() : Ok(tender);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<TenderDto>>> Search([FromQuery] string term) =>
        Ok(await _service.Search(term));

    [HttpPost]
    public async Task<ActionResult> Create(TenderRequestDto tender)
    {
        var id = await _service.Create(tender);
        return CreatedAtAction(nameof(GetById), new { id }, new { Id = id });
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, TenderRequestDto tender)
    {
        var updated = await _service.Update(id, tender);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await _service.Delete(id);
        return deleted ? NoContent() : NotFound();
    }
}
