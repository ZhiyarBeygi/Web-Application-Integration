namespace TenderManagement.DTOs;

public class TenderListItemDto
{
    public int Id { get; set; }
    public string TenderCode { get; set; } = "";
    public string Title { get; set; } = "";
    public string? CallNumber { get; set; }
    public DateTime? DocumentsSubmissionDeadline { get; set; }
    public string? CompanyName { get; set; }
    public string? Employer { get; set; }
    public string? City { get; set; }
    public string? TenderStatus { get; set; }
    public string? RecordStatus { get; set; }
    public string? ComputedStatus { get; set; }
    public int? DaysUntilDeadline { get; set; }
}
