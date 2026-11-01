import { useEffect, useMemo, useState } from "react";
import { getTenders } from "../../../api/tenderApi";

const columns = [
  { key: "tenderCode", label: "کد مناقصه", width: "110px" },
  { key: "title", label: "عنوان مناقصه", width: "240px" },
  { key: "callNumber", label: "شماره فراخوان", width: "185px" },
  { key: "documentsPublishDate", label: "تاریخ انتشار اسناد", width: "175px" },
  { key: "documentsSubmissionDeadline", label: "آخرین مهلت تحویل اسناد", width: "195px" },
  { key: "documentsReceiptDeadline", label: "مهلت دریافت اسناد", width: "175px" },
  { key: "qualitativeEvaluationDate", label: "تاریخ اعلام نتایج ارزیابی کیفی", width: "220px" },
  { key: "employerEvaluationDate", label: "تاریخ ارزیابی کارفرما", width: "175px" },
  { key: "winnerName", label: "نام برنده", width: "160px" },
  { key: "score", label: "امتیاز", width: "90px" },
  { key: "isRfqScoreObtained", label: "کسب امتیاز ارزیابی کیفی", width: "170px" },
  { key: "isPartnershipPossible", label: "امکان مشارکت", width: "120px" },
  { key: "isGuaranteeRequired", label: "نیاز به ضمانت‌نامه", width: "150px" },
  { key: "ledToContract", label: "منجر به قرارداد", width: "140px" },
  { key: "proposedPrice", label: "مبلغ پیشنهادی", width: "150px" },
  { key: "guaranteeAmount", label: "مبلغ ضمانت‌نامه", width: "150px" },
  { key: "guaranteeAmountForeign", label: "مبلغ ضمانت‌نامه ارزی", width: "170px" },
  { key: "employerInitialEstimate", label: "برآورد اولیه کارفرما", width: "170px" },
  { key: "minQualitativeScore", label: "حداقل امتیاز کیفی", width: "150px" },
  { key: "technicalScoreCoefficient", label: "ضریب امتیاز فنی", width: "140px" },
  { key: "minTechnicalScore", label: "حداقل امتیاز فنی", width: "150px" },
  { key: "envelopeCount", label: "تعداد پاکت‌ها", width: "120px" },
  { key: "description", label: "توضیحات", width: "220px" },
  { key: "partnershipLeader", label: "سرگروه مشارکت", width: "150px" },
  { key: "companyName", label: "نام شرکت", width: "160px" },
  { key: "employer", label: "کارفرما", width: "150px" },
  { key: "city", label: "شهر", width: "100px" },
  { key: "responsiblePerson", label: "مسئول پیگیری", width: "140px" },
  { key: "documentSubmissionMethod", label: "روش تحویل اسناد", width: "160px" },
  { key: "currencyUnit", label: "واحد پول", width: "100px" },
  { key: "tenderType", label: "نوع مناقصه", width: "130px" },
  { key: "creditType", label: "نوع اعتبار", width: "130px" },
  { key: "tenderMethod", label: "روش برگزاری", width: "140px" },
  { key: "tenderStatus", label: "وضعیت مناقصه", width: "120px" },
  { key: "guaranteeType", label: "نوع ضمانت‌نامه", width: "150px" },
  { key: "recordStatus", label: "وضعیت رکورد", width: "120px" },
  { key: "createdAt", label: "تاریخ ثبت", width: "160px" },
  { key: "modifiedAt", label: "تاریخ بروزرسانی", width: "160px" },
];

const BOOLEAN_KEYS = new Set([
  "isRfqScoreObtained",
  "isPartnershipPossible",
  "isGuaranteeRequired",
  "ledToContract",
]);

const NUMBER_KEYS = new Set([
  "score",
  "proposedPrice",
  "guaranteeAmount",
  "guaranteeAmountForeign",
  "employerInitialEstimate",
  "minQualitativeScore",
  "technicalScoreCoefficient",
  "minTechnicalScore",
  "envelopeCount",
]);

const DATE_KEYS = new Set([
  "documentsPublishDate",
  "documentsSubmissionDeadline",
  "documentsReceiptDeadline",
  "qualitativeEvaluationDate",
  "employerEvaluationDate",
  "createdAt",
  "modifiedAt",
]);

function formatPersianDate(value) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getCellValue(tender, key) {
  const value = tender[key];

  if (DATE_KEYS.has(key)) {
    return formatPersianDate(value);
  }

  if (BOOLEAN_KEYS.has(key)) {
    if (value === null || value === undefined) return "--";
    return value ? "بله" : "خیر";
  }

  if (NUMBER_KEYS.has(key)) {
    if (value === null || value === undefined) return "--";
    return Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  return value ?? "--";
}

// Measures the widest text needed per column so the "expanded" state
// can use a real pixel width (required for width to be transitionable).
function useColumnAutoWidths(rows, active) {
  const [widths, setWidths] = useState({});

  useEffect(() => {
    if (!active) return;

    const measurer = document.createElement("span");
    measurer.style.position = "fixed";
    measurer.style.top = "-9999px";
    measurer.style.visibility = "hidden";
    measurer.style.whiteSpace = "nowrap";
    measurer.style.fontSize = "14px";
    measurer.style.fontWeight = "700";
    measurer.style.fontFamily = getComputedStyle(document.body).fontFamily;
    document.body.appendChild(measurer);

    const next = {};

    columns.forEach((column) => {
      let max = 0;

      measurer.textContent = column.label;
      max = Math.max(max, measurer.offsetWidth);

      rows.forEach((row) => {
        measurer.textContent = String(getCellValue(row, column.key));
        max = Math.max(max, measurer.offsetWidth);
      });

      next[column.key] = `${max + 30}px`;
    });

    document.body.removeChild(measurer);
    setWidths(next);
  }, [active, rows]);

  return widths;
}

export default function TenderTable({ searchTerm = "", columnsExpanded = false, onRowDoubleClick }) {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTenders() {
      try {
        setLoading(true);
        setError("");

        const data = await getTenders();

        if (!cancelled) {
          setTenders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "خطا در دریافت مناقصات");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTenders();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTenders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return tenders;

    return tenders.filter((tender) =>
      [
        tender.tenderCode,
        tender.title,
        tender.callNumber,
        tender.companyName,
        tender.employer,
        tender.city,
      ].some((value) => String(value ?? "").toLowerCase().includes(term)),
    );
  }, [searchTerm, tenders]);

  const autoWidths = useColumnAutoWidths(filteredTenders, columnsExpanded);

  if (loading) {
    return <div className="tender-table-state">در حال دریافت مناقصات...</div>;
  }

  if (error) {
    return <div className="tender-table-state tender-table-error">{error}</div>;
  }

  if (filteredTenders.length === 0) {
    return <div className="tender-table-state">مناقصه‌ای پیدا نشد.</div>;
  }

  return (
    <div className="tender-table-wrapper">
      <table className="tender-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{
                  width: columnsExpanded
                    ? autoWidths[column.key] || column.width
                    : column.width,
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredTenders.map((tender) => (
            <tr key={tender.id} onDoubleClick={() => onRowDoubleClick?.(tender)}>
              {columns.map((column) => (
                <td key={column.key} title={String(getCellValue(tender, column.key))}>
                  {getCellValue(tender, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}