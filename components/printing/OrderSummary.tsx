"use client";

import Link from "next/link";
import type { PricingResult } from "@/types/printing";
import { formatPrintPrice } from "@/components/printing/printing-config";

type OrderSummaryProps = {
  canAddToCart: boolean;
  pricing: PricingResult;
  successMessage?: string;
  onAddToCart: () => void;
};

export function OrderSummary({
  canAddToCart,
  onAddToCart,
  pricing,
  successMessage,
}: OrderSummaryProps) {
  return (
    <aside className="w-full min-w-0 rounded-[9px] border border-[#DFE2E5] bg-white p-4 shadow-sm md:p-6">
      <h2 className="w-full text-start font-heading text-[24px] font-bold leading-[1.3] text-auth-ink">
        ملخص الطلب
      </h2>

      <dl className="mt-8 space-y-5">
        <div className="flex w-full items-center justify-between gap-4">
          <dt className="min-w-0 text-start font-body text-[16px] font-semibold text-auth-ink">
            المجموع الفرعي
          </dt>
          <dd className="shrink-0 whitespace-nowrap text-end font-body text-[16px] font-semibold text-auth-ink">
            <bdi dir="ltr">{formatPrintPrice(pricing.printingSubtotal)}</bdi>
          </dd>
        </div>
        <div className="flex w-full items-center justify-between gap-4">
          <dt className="min-w-0 text-start font-body text-[16px] font-semibold text-auth-ink">
            التجليد
          </dt>
          <dd className="shrink-0 whitespace-nowrap text-end font-body text-[16px] font-semibold text-auth-ink">
            <bdi dir="ltr">{formatPrintPrice(pricing.bindingTotal)}</bdi>
          </dd>
        </div>
      </dl>

      <div className="my-6 h-px bg-auth-border" />

      <div className="flex w-full items-center justify-between gap-4">
        <p className="min-w-0 text-start font-heading text-[24px] font-bold text-auth-ink">
          المجموع الكلي
        </p>
        <p className="shrink-0 whitespace-nowrap text-end font-body text-[20px] font-bold text-auth-accent">
          <bdi dir="ltr">{formatPrintPrice(pricing.grandTotal)}</bdi>
        </p>
      </div>

      <div className="my-6 h-px bg-auth-border" />

      <div className="grid gap-4">
        <button
          className="h-12 rounded-md bg-auth-accent px-6 font-body text-[18px] font-bold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-auth-accent/45"
          disabled={!canAddToCart}
          onClick={onAddToCart}
          type="button"
        >
          إضافة للسلة
        </button>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-md border border-auth-ink px-6 font-body text-[18px] font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
          href="/products"
          prefetch={false}
        >
          متابعة التسوق
        </Link>
      </div>

      <div aria-live="polite">
        {successMessage ? (
          <p className="mt-5 rounded-md bg-auth-success-soft px-4 py-3 text-center text-base font-bold text-auth-success">
            {successMessage}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
