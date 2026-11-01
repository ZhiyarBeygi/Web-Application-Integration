import { useEffect, useState } from "react";
import { getTenderById, updateTender } from "../../../api/tenderApi";
import "./TenderEditPage.css";

const TENDER_INFO_FIELDS = [
  { key: "tenderCode", label: "کد مناقصه", type: "text", required: true },
  { key: "title", label: "عنوان مناقصه", type: "text", required: true, fullWidth: true },
  { key: "callNumber", label: "شماره فراخوان", type: "text" },
  { key: "tenderType", label: "نوع مناقصه", type: "text" },
  { key: "tenderMethod", label: "روش مناقصه", type: "text" },
  { key: "tenderStatus", label: "وضعیت مناقصه", type: "select", options: ["فعال", "لغو شده", "تجدید شده"] },
  { key: "employer", label: "مناقصه‌گذار", type: "text" },
  { key: "documentSubmissionMethod", label: "روش ارسال اسناد", type: "text" },
  { key: "responsiblePerson", label: "مسئول انجام", type: "text" },
  { key: "documentsPublishDate", label: "تاریخ انتشار اسناد", type: "date" },
  { key: "city", label: "شهر محل اجرا", type: "text" },
  { key: "documentsSubmissionDeadline", label: "آخرین مهلت تحویل اسناد", type: "date" },
  { key: "documentsReceiptDeadline", label: "مهلت دریافت اسناد", type: "date" },
  { key: "qualitativeEvaluationDate", label: "تاریخ ارزیابی کیفی", type: "date" },
  { key: "employerEvaluationDate", label: "تاریخ ارزیابی کارفرما", type: "date" },
  { key: "score", label: "امتیاز کسب شده", type: "number" },
  { key: "isPartnershipPossible", label: "امکان مشارکت", type: "checkbox" },
  { key: "employerInitialEstimate", label: "برآورد کارفرما", type: "number" },
  { key: "ledToContract", label: "منجر به قرارداد شد", type: "checkbox" },
  { key: "recordStatus", label: "وضعیت رکورد", type: "select", options: ["موقت", "قطعی"] },
  { key: "companyName", label: "شرکت", type: "text" },
  { key: "winnerName", label: "نام برنده", type: "text" },
  { key: "description", label: "توضیحات", type: "textarea", fullWidth: true },
  { key: "partnershipLeader", label: "رهبر مشارکت", type: "text" },
];

const FINANCIAL_FIELDS = [
  { key: "creditType", label: "نوع تامین اعتبار", type: "text" },
  { key: "proposedPrice", label: "قیمت پیشنهادی", type: "number" },
  { key: "minTechnicalScore", label: "حداقل امتیاز فنی", type: "number" },
  { key: "technicalScoreCoefficient", label: "ضریب امتیاز فنی", type: "number" },
  { key: "minQualitativeScore", label: "حداقل امتیاز کیفی", type: "number" },
  { key: "isRfqScoreObtained", label: "کسب امتیاز ارزیابی کیفی", type: "checkbox" },
  { key: "isGuaranteeRequired", label: "نیاز به ارائه تضمین", type: "checkbox" },
  { key: "envelopeCount", label: "تعداد پاکت", type: "number" },
  { key: "guaranteeAmount", label: "مبلغ تضمین", type: "number" },
  { key: "guaranteeAmountForeign", label: "مبلغ تضمین غیر ریالی", type: "number" },
  { key: "currencyUnit", label: "واحد ارز", type: "text" },
  { key: "guaranteeType", label: "نوع ضمانت‌نامه", type: "text" },
];

const NUMBER_KEYS = [
  "score", "proposedPrice", "minQualitativeScore", "guaranteeAmount",
  "guaranteeAmountForeign", "employerInitialEstimate", "technicalScoreCoefficient",
  "minTechnicalScore", "envelopeCount",
];

const DATE_KEYS = [
  "documentsPublishDate", "documentsSubmissionDeadline", "documentsReceiptDeadline",
  "qualitativeEvaluationDate", "employerEvaluationDate",
];

const BOOLEAN_KEYS = [
  "isRfqScoreObtained", "isPartnershipPossible", "isGuaranteeRequired", "ledToContract",
];

const STRING_KEYS = [
  "tenderCode", "title", "callNumber", "winnerName", "description", "partnershipLeader",
  "companyName", "employer", "city", "responsiblePerson", "documentSubmissionMethod",
  "currencyUnit", "tenderType", "creditType", "tenderMethod", "tenderStatus",
  "guaranteeType", "recordStatus",
];

function mapTenderToForm(tender) {
  const form = {};

  STRING_KEYS.forEach((key) => {
    form[key] = tender[key] ?? "";
  });

  NUMBER_KEYS.forEach((key) => {
    const value = tender[key];
    form[key] = value === null || value === undefined ? "" : String(value);
  });

  DATE_KEYS.forEach((key) => {
    const value = tender[key];
    form[key] = value ? String(value).slice(0, 10) : "";
  });

  BOOLEAN_KEYS.forEach((key) => {
    form[key] = Boolean(tender[key]);
  });

  return form;
}

function validate(form) {
  const errors = {};

  if (!form.tenderCode.trim()) {
    errors.tenderCode = "وارد کردن کد مناقصه الزامی است.";
  }

  if (!form.title.trim()) {
    errors.title = "وارد کردن عنوان مناقصه الزامی است.";
  }

  if (form.isGuaranteeRequired && !form.guaranteeAmount) {
    errors.guaranteeAmount = "چون نیاز به ضمانت فعال است، وارد کردن مبلغ تضمین الزامی است.";
  }

  return errors;
}

function buildPayload(form) {
  const payload = { ...form };

  NUMBER_KEYS.forEach((key) => {
    payload[key] = form[key] === "" ? null : Number(form[key]);
  });

  DATE_KEYS.forEach((key) => {
    payload[key] = form[key] === "" ? null : form[key];
  });

  STRING_KEYS.forEach((key) => {
    if (key !== "tenderCode" && key !== "title" && payload[key] === "") {
      payload[key] = null;
    }
  });

  return payload;
}

function FieldInput({ field, value, error, onChange }) {
  if (field.type === "checkbox") {
    return (
      <label className="tender-edit-checkbox">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(field.key, e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div className={`tender-edit-field${field.fullWidth ? " tender-edit-field--full" : ""}`}>
        <label className="tender-edit-field-label">{field.label}</label>
        <select
          className="tender-edit-input"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          {value && !field.options.includes(value) && (
            <option value={value}>{value}</option>
          )}
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={`tender-edit-field${field.fullWidth ? " tender-edit-field--full" : ""}`}>
        <label className="tender-edit-field-label">{field.label}</label>
        <textarea
          className="tender-edit-input tender-edit-textarea"
          value={value}
          rows={3}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={`tender-edit-field${field.fullWidth ? " tender-edit-field--full" : ""}`}>
      <label className="tender-edit-field-label">
        {field.label}
        {field.required && <span className="tender-edit-required">*</span>}
      </label>
      <input
        className={`tender-edit-input${error ? " tender-edit-input--error" : ""}`}
        type={field.type}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {error && <span className="tender-edit-field-error">{error}</span>}
    </div>
  );
}

function FieldGrid({ fields, form, errors, onChange }) {
  return (
    <div className="tender-edit-fields">
      {fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={form[field.key]}
          error={errors[field.key]}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

export default function TenderEditPage({ tenderId, onNavigate }) {
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTender() {
      try {
        setLoading(true);
        setLoadError("");

        const tender = await getTenderById(tenderId);

        if (!cancelled) {
          setForm(mapTenderToForm(tender));
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || "خطا در دریافت اطلاعات مناقصه");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTender();

    return () => {
      cancelled = true;
    };
  }, [tenderId]);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

    async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
        const payload = buildPayload(form);

        await updateTender(tenderId, payload);

        setSubmitSuccess("مناقصه با موفقیت ویرایش شد.");
    } catch (err) {
        setSubmitError(err.message || "خطا در ویرایش مناقصه");
    } finally {
        setSubmitting(false);
    }
  }

  return (
    <section className="tender-edit-page">
      <div className="tender-edit-back-row">
        <button
          type="button"
          className="tender-edit-back-button"
          onClick={() => onNavigate(`/tendermenu/${tenderId}`)}
        >
          <span>بازگشت به مشاهده مناقصه</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {loading && (
        <div className="tender-edit-state">در حال دریافت اطلاعات مناقصه...</div>
      )}

      {!loading && loadError && (
        <div className="tender-edit-state tender-edit-load-error">{loadError}</div>
      )}

      {!loading && !loadError && form && (
        <form className="tender-edit-card" onSubmit={handleSubmit}>
          <div className="tender-edit-title-bar">ویرایش مناقصه</div>

          {submitError && (
            <div className="tender-edit-submit-error">
                {submitError}
            </div>
           )}

           {submitSuccess && (
            <div className="tender-edit-submit-success">
                {submitSuccess}
            </div>
           )}

          <div className="tender-edit-panels">
            <div className="tender-edit-panel">
              <div className="tender-edit-panel-title">اطلاعات مناقصه</div>
              <FieldGrid
                fields={TENDER_INFO_FIELDS}
                form={form}
                errors={errors}
                onChange={handleChange}
              />
            </div>

            <div className="tender-edit-panel">
              <div className="tender-edit-panel-title">اطلاعات مالی و تضامین</div>
              <FieldGrid
                fields={FINANCIAL_FIELDS}
                form={form}
                errors={errors}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="tender-edit-actions">
            <button
              type="button"
              className="tender-edit-cancel-button"
              onClick={() => onNavigate(`/tendermenu/${tenderId}`)}
              disabled={submitting}
            >
              انصراف
            </button>

            <button type="submit" className="tender-edit-submit-button" disabled={submitting}>
              {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}