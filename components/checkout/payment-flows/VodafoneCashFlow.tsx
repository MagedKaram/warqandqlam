"use client";

import { SelectedPaymentMethodSummary } from "@/components/checkout/SelectedPaymentMethodSummary";
import { TransferProofFields } from "@/components/checkout/payment-flows/TransferProofFields";
import {
  inspectVodafoneReceiptFile,
  VODAFONE_CASH_CONFIG,
} from "@/lib/checkout/vodafone-cash";
import type {
  VodafoneCashDetails,
  VodafoneCashDetailsErrors,
  VodafoneCashTextField,
  VodafoneReceiptMetadata,
} from "@/types/checkout";

type VodafoneCashFlowProps = {
  details: VodafoneCashDetails;
  errors: VodafoneCashDetailsErrors;
  onTextChange: (field: VodafoneCashTextField, value: string) => void;
  onReceiptChange: (
    receipt: VodafoneReceiptMetadata | null,
    error?: string,
  ) => void;
  onChangePaymentMethod: () => void;
};

export function VodafoneCashFlow({
  details,
  errors,
  onChangePaymentMethod,
  onReceiptChange,
  onTextChange,
}: VodafoneCashFlowProps) {
  return (
    <section className="min-w-0" aria-labelledby="vodafone-payment-title">
      <h1
        className="w-full text-start font-heading text-4xl font-bold text-auth-ink sm:text-5xl"
        id="vodafone-payment-title"
      >
        طريقة الدفع
      </h1>

      <SelectedPaymentMethodSummary
        className="mt-8"
        methodId="vodafone_cash"
        onChangePaymentMethod={onChangePaymentMethod}
      />

      <dl className="mt-6 grid min-w-0 gap-3 text-start text-base font-semibold leading-7 text-auth-ink sm:grid-cols-2 sm:gap-10">
        <div className="flex min-w-0 flex-wrap items-baseline gap-2">
          <dt className="font-bold">رقم فودافون كاش:</dt>
          <dd className="min-w-0">
            <bdi className="whitespace-nowrap" dir="ltr">
              {VODAFONE_CASH_CONFIG.walletNumber}
            </bdi>
          </dd>
        </div>
        <div className="flex min-w-0 flex-wrap items-baseline gap-2">
          <dt className="font-bold">الاسم:</dt>
          <dd className="min-w-0">{VODAFONE_CASH_CONFIG.accountName}</dd>
        </div>
      </dl>

      <div className="mt-5 text-start text-base font-semibold leading-8 text-auth-ink">
        <p className="font-bold">خطوات الدفع:</p>
        <ol className="mt-1 list-none">
          {VODAFONE_CASH_CONFIG.instructions.map((instruction, index) => (
            <li key={instruction}>
              <bdi dir="ltr">{index + 1}-</bdi> {instruction}
            </li>
          ))}
        </ol>
      </div>

      <TransferProofFields
        details={details}
        errors={errors}
        idPrefix="vodafone"
        inspectReceiptFile={inspectVodafoneReceiptFile}
        onReceiptChange={onReceiptChange}
        onTextChange={onTextChange}
      />
    </section>
  );
}
