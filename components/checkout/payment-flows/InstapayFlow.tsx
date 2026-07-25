"use client";

import Image from "next/image";
import { SelectedPaymentMethodSummary } from "@/components/checkout/SelectedPaymentMethodSummary";
import { TransferProofFields } from "@/components/checkout/payment-flows/TransferProofFields";
import {
  inspectInstapayReceiptFile,
  INSTAPAY_CONFIG,
} from "@/lib/checkout/instapay";
import type {
  InstapayDetails,
  InstapayDetailsErrors,
  InstapayReceiptMetadata,
  InstapayTextField,
} from "@/types/checkout";

type InstapayFlowProps = {
  details: InstapayDetails;
  errors: InstapayDetailsErrors;
  onReceiptChange: (
    receipt: InstapayReceiptMetadata | null,
    error?: string,
  ) => void;
  onChangePaymentMethod: () => void;
  onTextChange: (field: InstapayTextField, value: string) => void;
};

function TransferTarget({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt
        className="block w-full text-start text-base font-bold text-auth-ink"
        id={`${id}-label`}
      >
        {label}
      </dt>
      <dd
        aria-labelledby={`${id}-label`}
        aria-readonly="true"
        className="mt-3 flex h-[50px] w-full min-w-0 max-w-full items-center rounded-md border border-auth-border bg-white px-4 text-start text-base font-semibold text-auth-muted"
        role="textbox"
      >
        <bdi className="max-w-full truncate" dir="ltr" title={value}>
          {value}
        </bdi>
      </dd>
    </div>
  );
}

export function InstapayFlow({
  details,
  errors,
  onChangePaymentMethod,
  onReceiptChange,
  onTextChange,
}: InstapayFlowProps) {
  return (
    <section className="min-w-0" aria-labelledby="instapay-payment-title">
      <h1
        className="w-full text-start font-heading text-4xl font-bold text-auth-ink sm:text-5xl"
        id="instapay-payment-title"
      >
        طريقة الدفع
      </h1>

      <SelectedPaymentMethodSummary
        className="mt-8"
        methodId="instapay"
        onChangePaymentMethod={onChangePaymentMethod}
      />

      <dl className="mt-6 grid min-w-0 gap-6 sm:grid-cols-2 sm:gap-10">
        <TransferTarget
          id="instapay-username"
          label="اسم المستخدم"
          value={INSTAPAY_CONFIG.username}
        />
        <TransferTarget
          id="instapay-phone"
          label="رقم الهاتف"
          value={INSTAPAY_CONFIG.phoneNumber}
        />
      </dl>

      <p className="mt-5 w-full text-start text-base font-bold text-auth-ink">
        او امسح <bdi dir="ltr">QR Code</bdi> للتحويل
      </p>

      <Image
        alt="رمز QR للتحويل عبر Instapay"
        className="mx-auto mt-4 h-auto w-[284px] max-w-full object-contain"
        height={284}
        priority
        src={INSTAPAY_CONFIG.qrCodePath}
        width={284}
      />

      <div className="mt-3 text-start text-base font-semibold leading-8 text-auth-ink">
        <p className="font-bold">خطوات الدفع:</p>
        <ol className="mt-1 list-none">
          {INSTAPAY_CONFIG.instructions.map((instruction, index) => (
            <li key={instruction}>
              <bdi dir="ltr">{index + 1}-</bdi> {instruction}
            </li>
          ))}
        </ol>
      </div>

      <TransferProofFields
        details={details}
        errors={errors}
        idPrefix="instapay"
        inspectReceiptFile={inspectInstapayReceiptFile}
        lastFourLabel="اخر 4 ارقام من رقم الهاتف"
        onReceiptChange={onReceiptChange}
        onTextChange={onTextChange}
      />
    </section>
  );
}
