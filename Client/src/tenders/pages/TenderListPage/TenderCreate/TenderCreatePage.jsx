
import { useState } from "react";
import { createTender } from "../../../api/tenderApi";
import "./TenderCreatePage.css";

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

const INITIAL_FORM = {
  tenderCode: "", title: "", callNumber: "",
  documentsPublishDate: "", documentsSubmissionDeadline: "", documentsReceiptDeadline: "",
  qualitativeEvaluationDate: "", employerEvaluationDate: "",
  winnerName: "", score: "", isRfqScoreObtained: false, proposedPrice: "",
  minQualitativeScore: "", isPartnershipPossible: false, isGuaranteeRequired: false,
  guaranteeAmount: "", guaranteeAmountForeign: "", employerInitialEstimate: "",
  technicalScoreCoefficient: "", minTechnicalScore: "",
  description: "", partnershipLeader: "", companyName: "", employer: "", city: "",
  responsiblePerson: "", documentSubmissionMethod: "", currencyUnit: "ریال",
  tenderType: "", creditType: "", tenderMethod: "", tenderStatus: "فعال",
  guaranteeType: "", recordStatus: "موقت", envelopeCount: "", ledToContract: false,
};

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

  Object.keys(payload).forEach((key) => {
    if (typeof payload[key] === "string" && payload[key] === "" && key !== "tenderCode" && key !== "title") {
      payload[key] = null;
    }
  });

  return payload;
}

function FieldInput({ field, value, error, onChange }) {
  if (field.type === "checkbox") {
    return (
      <label className="tender-create-checkbox">
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
      <div className={`tender-create-field${field.fullWidth ? " tender-create-field--full" : ""}`}>
        <label className="tender-create-field-label">{field.label}</label>
        <select
          className="tender-create-input"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
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
      <div className={`tender-create-field${field.fullWidth ? " tender-create-field--full" : ""}`}>
        <label className="tender-create-field-label">{field.label}</label>
        <textarea
          className="tender-create-input tender-create-textarea"
          value={value}
          rows={3}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={`tender-create-field${field.fullWidth ? " tender-create-field--full" : ""}`}>
      <label className="tender-create-field-label">
        {field.label}
        {field.required && <span className="tender-create-required">*</span>}
      </label>
      <input
        className={`tender-create-input${error ? " tender-create-input--error" : ""}`}
        type={field.type}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {error && <span className="tender-create-field-error">{error}</span>}
    </div>
  );
}

function FieldGrid({ fields, form, errors, onChange }) {
  return (
    <div className="tender-create-fields">
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

export default function TenderCreatePage({ onNavigate }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

    try {
      const payload = buildPayload(form);
      const result = await createTender(payload);
      const newId = result?.id ?? result?.Id;

      onNavigate(newId ? `/tendermenu/${newId}` : "/tendermenu");
    } catch (err) {
      setSubmitError(err.message || "خطا در ثبت مناقصه");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="tender-create-page">
      <div className="tender-create-back-row">
        <button
          type="button"
          className="tender-create-back-button"
          onClick={() => onNavigate("/tendermenu")}
        >
          <span>بازگشت به لیست</span>
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

      <form className="tender-create-card" onSubmit={handleSubmit}>
        <div className="tender-create-title-bar">ثبت مناقصه جدید</div>

        {submitError && (
          <div className="tender-create-submit-error">{submitError}</div>
        )}

        <div className="tender-create-panels">
          <div className="tender-create-panel">
            <div className="tender-create-panel-title">اطلاعات مناقصه</div>
            <FieldGrid
              fields={TENDER_INFO_FIELDS}
              form={form}
              errors={errors}
              onChange={handleChange}
            />
          </div>

          <div className="tender-create-panel">
            <div className="tender-create-panel-title">اطلاعات مالی و تضامین</div>
            <FieldGrid
              fields={FINANCIAL_FIELDS}
              form={form}
              errors={errors}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="tender-create-actions">
          <button
            type="button"
            className="tender-create-cancel-button"
            onClick={() => onNavigate("/tendermenu")}
            disabled={submitting}
          >
            انصراف
          </button>

          <button type="submit" className="tender-create-submit-button" disabled={submitting}>
            {submitting ? "در حال ثبت..." : "ثبت مناقصه"}
          </button>
        </div>
      </form>
    </section>
  );
}