namespace TenderManagement.DTOs;

public class TenderRequestDto
{
    public string TenderCode { get; set; } = "";
    public string Title { get; set; } = "";
    public string? CallNumber { get; set; }

    public DateTime? DocumentsPublishDate { get; set; }
    public DateTime? DocumentsSubmissionDeadline { get; set; }
    public DateTime? DocumentsReceiptDeadline { get; set; }
    public DateTime? QualitativeEvaluationDate { get; set; }
    public DateTime? EmployerEvaluationDate { get; set; }

    public string? WinnerName { get; set; }
    public decimal? Score { get; set; }
    public bool? IsRfqScoreObtained { get; set; }
    public decimal? ProposedPrice { get; set; }
    public decimal? MinQualitativeScore { get; set; }
    public bool? IsPartnershipPossible { get; set; }
    public bool? IsGuaranteeRequired { get; set; }
    public decimal? GuaranteeAmount { get; set; }
    public decimal? GuaranteeAmountForeign { get; set; }
    public decimal? EmployerInitialEstimate { get; set; }
    public decimal? TechnicalScoreCoefficient { get; set; }
    public decimal? MinTechnicalScore { get; set; }

    public string? Description { get; set; }
    public string? PartnershipLeader { get; set; }
    public string? CompanyName { get; set; }
    public string? Employer { get; set; }
    public string? City { get; set; }
    public string? ResponsiblePerson { get; set; }

    public string? DocumentSubmissionMethod { get; set; }
    public string? CurrencyUnit { get; set; }
    public string? TenderType { get; set; }
    public string? CreditType { get; set; }
    public string? TenderMethod { get; set; }
    public string? TenderStatus { get; set; }
    public string? GuaranteeType { get; set; }
    public string? RecordStatus { get; set; }
    public int? EnvelopeCount { get; set; }
    public bool? LedToContract { get; set; }
}
