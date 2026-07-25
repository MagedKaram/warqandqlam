"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { PiFileText } from "react-icons/pi";
import { CouponControl } from "@/components/cart/CouponControl";
import { PRINTING_PRICING } from "@/components/printing/printing-config";
import {
  formatCartMoney,
  getFreeShippingMessage,
} from "@/lib/cart/cart-calculations";
import type { CartCoupon } from "@/lib/cart/cart-config";
import type {
  CartItem,
  CartTotals,
  PrintingCartAggregate,
} from "@/types/cart";

type OrderSummaryProps = {
  items: CartItem[];
  totals: CartTotals;
  printingAggregate: PrintingCartAggregate;
  appliedCoupon: CartCoupon | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  showCoupon?: boolean;
  showFreeShippingMessage?: boolean;
  showItems?: boolean;
  title?: string;
};

function SummaryRow({
  label,
  value,
  isolate = true,
  valueClassName = "text-auth-ink",
}: {
  label: string;
  value: ReactNode;
  isolate?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-4">
      <dt className="min-w-0 text-start font-body text-base font-semibold text-auth-ink">
        {label}
      </dt>
      <dd
        className={`shrink-0 whitespace-nowrap text-end font-body text-base font-semibold ${valueClassName}`}
      >
        {isolate ? <bdi dir="ltr">{value}</bdi> : value}
      </dd>
    </div>
  );
}

function getSingleLabel<Value extends string>(
  values: Value[],
  registry: Record<Value, { label: string }>,
) {
  if (values.length !== 1) {
    return "خيارات متعددة";
  }

  return registry[values[0]].label;
}

function SummaryItemPreview({ item }: { item: CartItem }) {
  if (item.kind === "printing") {
    const pageCount = item.files.reduce(
      (sum, file) => sum + file.pageCount,
      0,
    );

    return (
      <article className="flex min-w-0 items-center gap-3 border-b border-neutral-400 py-4 last:border-b-0">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-home-promo text-auth-accent">
          <PiFileText aria-hidden className="text-3xl" />
          <bdi
            className="absolute -top-2 start-0 flex h-7 min-w-7 items-center justify-center rounded-lg bg-auth-ink px-1 text-xs font-bold text-white"
            dir="ltr"
          >
            {pageCount}
          </bdi>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-start text-sm font-bold text-auth-ink">
            طلب طباعة {item.files.length === 1 ? "ملف" : `${item.files.length} ملفات`}
          </p>
          <bdi
            className="mt-1 block max-w-full truncate text-start text-xs font-semibold text-auth-muted"
            dir="ltr"
            title={item.files[0].originalName}
          >
            {item.files[0].originalName}
          </bdi>
          <bdi
            className="mt-1 block whitespace-nowrap text-start text-sm font-bold text-auth-accent"
            dir="ltr"
          >
            {formatCartMoney(item.priceQuote.total)}
          </bdi>
        </div>
      </article>
    );
  }

  return (
    <article className="flex min-w-0 items-center gap-3 border-b border-neutral-400 py-4 last:border-b-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-cool-200">
        <Image
          alt=""
          className="object-contain p-1"
          fill
          sizes="64px"
          src={item.image}
        />
        <bdi
          className="absolute -top-1 start-0 flex h-7 min-w-7 items-center justify-center rounded-lg bg-auth-ink px-1 text-xs font-bold text-white"
          dir="ltr"
        >
          {item.quantity}
        </bdi>
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-start text-sm font-bold leading-6 text-auth-ink">
          {item.title}
          {item.brandName ? (
            <>
              {" "}
              <bdi className="whitespace-nowrap" dir="ltr">
                {item.brandName}
              </bdi>
            </>
          ) : null}
        </p>
        {item.selectedColor ? (
          <p className="mt-0.5 text-start text-xs font-semibold text-auth-muted">
            اللون: {item.selectedColor.label}
          </p>
        ) : null}
        <bdi
          className="mt-1 block whitespace-nowrap text-start text-sm font-bold text-auth-accent"
          dir="ltr"
        >
          {formatCartMoney(item.unitPrice * item.quantity)}
        </bdi>
      </div>
    </article>
  );
}

export function OrderSummary({
  appliedCoupon,
  items,
  onApplyCoupon,
  onRemoveCoupon,
  primaryAction,
  printingAggregate,
  secondaryAction,
  showCoupon = true,
  showFreeShippingMessage = true,
  showItems = false,
  title = "ملخص الطلب",
  totals,
}: OrderSummaryProps) {
  const freeShippingMessage = getFreeShippingMessage(totals);
  const hasPrinting = printingAggregate.orderCount > 0;

  return (
    <aside
      className="w-full min-w-0 rounded-lg border border-neutral-400 bg-white p-4 sm:p-6"
      data-order-summary
    >
      <h2 className="w-full text-start font-heading text-3xl font-bold text-auth-ink">
        {title}
      </h2>

      {showItems ? (
        <div className="mt-5">
          {items.map((item) => (
            <SummaryItemPreview item={item} key={item.id} />
          ))}
        </div>
      ) : null}

      {hasPrinting ? (
        <dl className="mt-7 space-y-4 border-b border-neutral-400 pb-6">
          <SummaryRow label="عدد الملفات" value={printingAggregate.fileCount} />
          <SummaryRow label="إجمالي الصفحات" value={printingAggregate.totalPages} />
          <SummaryRow label="عدد النسخ" value={printingAggregate.totalCopies} />
          <SummaryRow
            isolate={false}
            label="نمط الطباعة"
            value={getSingleLabel(
              printingAggregate.printModes,
              PRINTING_PRICING.printModes,
            )}
          />
          <SummaryRow
            isolate={printingAggregate.paperSizes.length === 1}
            label="مقاس الورق"
            value={getSingleLabel(
              printingAggregate.paperSizes,
              PRINTING_PRICING.paperSizes,
            )}
          />
          <SummaryRow
            isolate={false}
            label="التجليد"
            value={getSingleLabel(
              printingAggregate.bindingTypes,
              PRINTING_PRICING.bindings,
            )}
          />
        </dl>
      ) : null}

      {showCoupon ? (
        <div className="mt-6">
          <CouponControl
            key={appliedCoupon?.code ?? "none"}
            appliedCode={appliedCoupon?.code ?? null}
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
          />
        </div>
      ) : null}

      <dl className="mt-6 space-y-4">
        {totals.productSubtotal > 0 ? (
          <SummaryRow
            label="مجموع المنتجات"
            value={formatCartMoney(totals.productSubtotal)}
          />
        ) : null}
        {totals.printingSubtotal > 0 ? (
          <SummaryRow
            label="مجموع الطباعة"
            value={formatCartMoney(totals.printingSubtotal)}
          />
        ) : null}
        <SummaryRow
          label="المجموع الفرعي"
          value={formatCartMoney(totals.subtotal)}
        />
        {totals.discount > 0 ? (
          <SummaryRow
            label={appliedCoupon?.label ?? "الخصم"}
            value={`-${formatCartMoney(totals.discount)}`}
            valueClassName="text-auth-success"
          />
        ) : null}
        <SummaryRow
          isolate={totals.shipping > 0}
          label="الشحن"
          value={
            totals.shipping > 0 ? formatCartMoney(totals.shipping) : "مجاني"
          }
          valueClassName={totals.shipping > 0 ? "text-auth-ink" : "text-auth-success"}
        />
      </dl>

      {showFreeShippingMessage && freeShippingMessage ? (
        <p
          className={`mt-6 rounded-md border px-3 py-3 text-center text-sm font-bold leading-6 ${
            totals.hasFreeShipping
              ? "border-auth-success bg-auth-success-soft text-auth-success"
              : "border-auth-accent bg-home-promo text-auth-accent"
          }`}
        >
          {freeShippingMessage}
        </p>
      ) : null}

      <div className="my-6 h-px bg-auth-border" />

      <div className="flex min-w-0 items-center justify-between gap-4">
        <p className="min-w-0 text-start font-heading text-2xl font-bold text-auth-ink">
          المجموع الكلي
        </p>
        <bdi
          className="shrink-0 whitespace-nowrap font-heading text-2xl font-bold text-auth-accent"
          dir="ltr"
        >
          {formatCartMoney(totals.total)}
        </bdi>
      </div>

      {primaryAction || secondaryAction ? (
        <div className="mt-6 grid gap-4">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </aside>
  );
}
