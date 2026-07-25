"use client";

import { DragEvent, useState } from "react";
import {
  PiCloudArrowUp,
  PiFileImage,
  PiTrash,
} from "react-icons/pi";
import {
  TRANSFER_RECEIPT_CONFIG,
  type TransferReceiptInspectionResult,
} from "@/lib/checkout/transfer-proof";
import type {
  TransferProofDetails,
  TransferProofDetailsErrors,
  TransferProofTextField,
  TransferReceiptMetadata,
} from "@/types/checkout";

type TransferProofFieldsProps = {
  details: TransferProofDetails;
  errors: TransferProofDetailsErrors;
  idPrefix: string;
  inspectReceiptFile: (file: File) => TransferReceiptInspectionResult;
  lastFourLabel?: string;
  onReceiptChange: (
    receipt: TransferReceiptMetadata | null,
    error?: string,
  ) => void;
  onTextChange: (field: TransferProofTextField, value: string) => void;
};

type TransferTextFieldProps = {
  error?: string;
  field: TransferProofTextField;
  idPrefix: string;
  inputMode?: "text" | "numeric";
  label: string;
  placeholder: string;
  value: string;
  onChange: (field: TransferProofTextField, value: string) => void;
};

function TransferTextField({
  error,
  field,
  idPrefix,
  inputMode = "text",
  label,
  onChange,
  placeholder,
  value,
}: TransferTextFieldProps) {
  const id = `${idPrefix}-${field}`;

  return (
    <div className="min-w-0">
      <label
        className="block w-full text-start text-base font-bold text-auth-ink"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        className={`mt-3 h-[50px] w-full min-w-0 max-w-full rounded-md border bg-white px-4 text-base font-semibold text-auth-ink outline-none transition placeholder:text-auth-muted focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-auth-border focus:border-auth-link focus:ring-auth-link/20"
        }`}
        dir={field === "senderPhoneLastFour" ? "ltr" : undefined}
        id={id}
        inputMode={inputMode}
        name={`${idPrefix}-${field}`}
        onChange={(event) => {
          const nextValue =
            field === "senderPhoneLastFour"
              ? event.target.value.replace(/\D/g, "").slice(0, 4)
              : event.target.value;
          onChange(field, nextValue);
        }}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {error ? (
        <p
          className="mt-2 text-start text-sm font-semibold text-red-600"
          id={`${id}-error`}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TransferProofFields({
  details,
  errors,
  idPrefix,
  inspectReceiptFile,
  lastFourLabel = "آخر 4 أرقام من رقم الهاتف",
  onReceiptChange,
  onTextChange,
}: TransferProofFieldsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const receiptId = `${idPrefix}-receipt`;

  function inspectReceipt(file: File | undefined) {
    if (!file) {
      return;
    }

    const inspection = inspectReceiptFile(file);
    if (inspection.valid) {
      onReceiptChange(inspection.metadata);
      return;
    }

    onReceiptChange(null, inspection.error);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    inspectReceipt(event.dataTransfer.files.item(0) ?? undefined);
  }

  return (
    <div className="min-w-0">
      <div className="mt-5 min-w-0">
        <label
          className={`flex min-h-40 w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-auth-accent has-[:focus-visible]:ring-offset-2 ${
            errors.receipt
              ? "border-red-500 bg-red-50"
              : isDragging
                ? "border-auth-accent bg-home-promo"
                : "border-auth-border bg-cool-200/30 hover:border-auth-accent"
          }`}
          htmlFor={receiptId}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsDragging(false);
            }
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            accept={TRANSFER_RECEIPT_CONFIG.acceptedExtension}
            aria-describedby={`${receiptId}-help${
              errors.receipt ? ` ${receiptId}-error` : ""
            }`}
            aria-invalid={Boolean(errors.receipt)}
            className="sr-only"
            id={receiptId}
            name={receiptId}
            onChange={(event) => {
              inspectReceipt(event.currentTarget.files?.item(0) ?? undefined);
              event.currentTarget.value = "";
            }}
            type="file"
          />

          {details.receipt ? (
            <>
              <PiFileImage
                aria-hidden
                className="text-4xl text-auth-accent"
              />
              <bdi
                className="mt-2 block max-w-full truncate text-sm font-bold text-auth-ink"
                dir="ltr"
                title={details.receipt.fileName}
              >
                {details.receipt.fileName}
              </bdi>
              <bdi
                className="mt-1 text-xs font-semibold text-auth-muted"
                dir="ltr"
                id={`${receiptId}-help`}
              >
                {Math.ceil(details.receipt.sizeBytes / 1024)} KB
              </bdi>
            </>
          ) : (
            <>
              <PiCloudArrowUp
                aria-hidden
                className="text-4xl text-auth-muted"
              />
              <p className="mt-2 text-sm font-bold text-auth-ink">
                <span className="text-auth-accent">اضغط للتحميل</span>{" "}
                أو اسحب وأسقط
              </p>
              <bdi
                className="mt-1 text-xs font-semibold text-auth-muted"
                dir="ltr"
                id={`${receiptId}-help`}
              >
                PNG less than 1MB
              </bdi>
            </>
          )}
        </label>

        {details.receipt ? (
          <button
            aria-label="إزالة صورة التحويل"
            className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            onClick={() => onReceiptChange(null)}
            type="button"
          >
            <PiTrash aria-hidden className="text-lg" />
            إزالة صورة التحويل
          </button>
        ) : null}

        {errors.receipt ? (
          <p
            className="mt-2 text-start text-sm font-semibold text-red-600"
            id={`${receiptId}-error`}
            role="alert"
          >
            {errors.receipt}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid min-w-0 gap-6 sm:grid-cols-2 sm:gap-10">
        <TransferTextField
          error={errors.senderName}
          field="senderName"
          idPrefix={idPrefix}
          label="اسم المحول"
          onChange={onTextChange}
          placeholder="ادخل اسم المحول"
          value={details.senderName}
        />
        <TransferTextField
          error={errors.senderPhoneLastFour}
          field="senderPhoneLastFour"
          idPrefix={idPrefix}
          inputMode="numeric"
          label={lastFourLabel}
          onChange={onTextChange}
          placeholder="8***"
          value={details.senderPhoneLastFour}
        />
      </div>
    </div>
  );
}
