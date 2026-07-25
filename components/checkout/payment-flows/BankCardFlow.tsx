"use client";

import type { ReactNode } from "react";
import { SelectedPaymentMethodSummary } from "@/components/checkout/SelectedPaymentMethodSummary";
import {
  formatCardExpiry,
  formatCardNumber,
  normalizeCardDigits,
} from "@/lib/checkout/bank-card";
import type {
  BankCardDetails,
  BankCardDetailsErrors,
  BankCardField,
} from "@/types/checkout";

type BankCardFlowProps = {
  details: BankCardDetails;
  errors: BankCardDetailsErrors;
  saveForLater: boolean;
  onChangePaymentMethod: () => void;
  onFieldChange: (field: BankCardField, value: string) => void;
  onSaveForLaterChange: (checked: boolean) => void;
};

type CardFieldProps = {
  autoComplete: string;
  dir?: "ltr";
  error?: string;
  id: string;
  inputMode?: "numeric" | "text";
  label: ReactNode;
  maxLength?: number;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "password" | "text";
  value: string;
};

function CardField({
  autoComplete,
  dir,
  error,
  id,
  inputMode = "text",
  label,
  maxLength,
  onBlur,
  onChange,
  placeholder,
  type = "text",
  value,
}: CardFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="min-w-0">
      <label
        className="block w-full text-start text-base font-bold text-auth-ink"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className={`mt-3 h-[50px] w-full min-w-0 max-w-full rounded-md border bg-white px-4 text-base font-semibold text-auth-ink outline-none transition placeholder:font-semibold placeholder:text-auth-muted focus:ring-2 ${
          dir === "ltr" ? "text-start placeholder:text-end" : "text-start"
        } ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-auth-border focus:border-auth-link focus:ring-auth-link/20"
        }`}
        dir={dir}
        id={id}
        inputMode={inputMode}
        maxLength={maxLength}
        onBlur={onBlur}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        required
        spellCheck={inputMode === "text"}
        type={type}
        value={value}
      />
      {error ? (
        <p
          className="mt-2 min-h-5 w-full text-start text-sm font-semibold leading-5 text-red-600"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function BankCardFlow({
  details,
  errors,
  onChangePaymentMethod,
  onFieldChange,
  onSaveForLaterChange,
  saveForLater,
}: BankCardFlowProps) {
  return (
    <section className="min-w-0" aria-labelledby="bank-card-payment-title">
      <h1
        className="w-full text-start font-heading text-4xl font-bold text-auth-ink sm:text-5xl"
        id="bank-card-payment-title"
      >
        طريقة الدفع
      </h1>

      <SelectedPaymentMethodSummary
        className="mt-8"
        methodId="bank_card"
        onChangePaymentMethod={onChangePaymentMethod}
      />

      <div className="mt-5 grid min-w-0 gap-x-10 gap-y-5 sm:grid-cols-2">
        <CardField
          autoComplete="cc-name"
          error={errors.cardholderName}
          id="bank-card-cardholder-name"
          label="اسم حامل البطاقة"
          onBlur={() =>
            onFieldChange(
              "cardholderName",
              details.cardholderName.trim(),
            )
          }
          onChange={(value) => onFieldChange("cardholderName", value)}
          placeholder="ادخل اسم حامل البطاقة"
          value={details.cardholderName}
        />

        <CardField
          autoComplete="cc-number"
          dir="ltr"
          error={errors.cardNumber}
          id="bank-card-number"
          inputMode="numeric"
          label="رقم البطاقة"
          maxLength={19}
          onChange={(value) =>
            onFieldChange("cardNumber", normalizeCardDigits(value, 16))
          }
          placeholder="ادخل رقم البطاقة"
          value={formatCardNumber(details.cardNumber)}
        />

        <CardField
          autoComplete="cc-exp"
          dir="ltr"
          error={errors.expiry}
          id="bank-card-expiry"
          inputMode="numeric"
          label="تاريخ الانتهاء"
          maxLength={5}
          onChange={(value) =>
            onFieldChange("expiry", normalizeCardDigits(value, 4))
          }
          placeholder="--/--"
          value={formatCardExpiry(details.expiry)}
        />

        <CardField
          autoComplete="cc-csc"
          dir="ltr"
          error={errors.cvv}
          id="bank-card-cvv"
          inputMode="numeric"
          label={<bdi dir="ltr">CVV</bdi>}
          maxLength={3}
          onChange={(value) =>
            onFieldChange("cvv", normalizeCardDigits(value, 3))
          }
          placeholder="..."
          type="password"
          value={details.cvv}
        />
      </div>

      <label className="mt-4 flex w-fit max-w-full cursor-pointer items-center gap-3 text-start text-base font-bold text-auth-ink">
        <input
          checked={saveForLater}
          className="h-5 w-5 shrink-0 rounded border-auth-border accent-auth-accent"
          onChange={(event) =>
            onSaveForLaterChange(event.currentTarget.checked)
          }
          type="checkbox"
        />
        <span className="min-w-0">حفظ هذه المعلومات للمرة القادمة</span>
      </label>

      {/*
        A real saved-card feature requires gateway tokenization. This visual
        preference remains transient and never stores PAN, expiry, or CVV.
      */}
    </section>
  );
}
