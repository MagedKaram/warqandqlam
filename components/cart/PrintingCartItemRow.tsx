"use client";

import { PiFileText, PiTrash, PiTruck } from "react-icons/pi";
import { formatCartMoney } from "@/lib/cart/cart-calculations";
import { PRINTING_PRICING } from "@/components/printing/printing-config";
import type { PrintingCartItem } from "@/types/cart";

type PrintingCartItemRowProps = {
  item: PrintingCartItem;
  onRemove: (itemId: string) => void;
};

export function PrintingCartItemRow({
  item,
  onRemove,
}: PrintingCartItemRowProps) {
  const totalPages = item.files.reduce(
    (pageCount, file) => pageCount + file.pageCount,
    0,
  );
  const firstFile = item.files[0];

  return (
    <article
      className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-lg border border-neutral-400 bg-white p-4 sm:grid-cols-[112px_minmax(0,1fr)_64px] sm:gap-5 sm:p-5"
      data-cart-item-kind="printing"
    >
      <div className="relative col-start-1 row-start-1 flex h-28 w-[88px] items-center justify-center rounded-lg bg-home-promo text-auth-accent sm:h-32 sm:w-28">
        <PiFileText aria-hidden className="text-5xl" />
        <bdi
          aria-label={`${totalPages} صفحة`}
          className="absolute -top-2 start-0 flex h-9 min-w-9 items-center justify-center rounded-xl bg-auth-ink px-2 text-sm font-bold text-white"
          dir="ltr"
        >
          {totalPages}
        </bdi>
      </div>

      <div className="col-start-2 row-start-1 min-w-0">
        <h2 className="w-full min-w-0 text-start font-body text-lg font-bold leading-8 text-auth-ink sm:text-xl">
          طباعة {item.files.length === 1 ? "ملف" : `${item.files.length} ملفات`}
        </h2>
        <bdi
          className="mt-1 block max-w-full break-all text-start text-sm font-semibold text-auth-muted sm:text-base"
          dir="ltr"
        >
          {firstFile.originalName}
        </bdi>
        {item.files.length > 1 ? (
          <p className="mt-1 text-start text-sm font-semibold text-auth-muted">
            و{item.files.length - 1} ملف إضافي
          </p>
        ) : null}

        <p className="mt-3 flex min-w-0 items-center gap-2 text-start text-sm font-semibold leading-6 text-auth-success sm:text-base">
          <PiTruck aria-hidden className="shrink-0 text-2xl" />
          <span className="min-w-0">يصل خلال 2–5 أيام عمل</span>
        </p>

        <dl className="mt-4 flex min-w-0 flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-auth-muted">
          <div className="flex items-center gap-1">
            <dt>النسخ:</dt>
            <dd>
              <bdi dir="ltr">{item.options.copies}</bdi>
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <dt>النمط:</dt>
            <dd>{PRINTING_PRICING.printModes[item.options.printMode].label}</dd>
          </div>
          <div className="flex items-center gap-1">
            <dt>الورق:</dt>
            <dd>
              <bdi dir="ltr">
                {PRINTING_PRICING.paperSizes[item.options.paperSize].label}
              </bdi>
            </dd>
          </div>
        </dl>
      </div>

      <div className="col-span-2 col-start-1 row-start-2 flex items-center justify-between gap-3 border-t border-neutral-400 pt-3 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:flex-col sm:border-0 sm:pt-0">
        <button
          aria-label="إزالة طلب الطباعة من السلة"
          className="flex h-11 w-11 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          onClick={() => onRemove(item.id)}
          type="button"
        >
          <PiTrash aria-hidden className="text-2xl" />
        </button>

        <bdi
          className="shrink-0 whitespace-nowrap font-heading text-xl font-bold text-auth-accent"
          dir="ltr"
        >
          {formatCartMoney(item.priceQuote.total)}
        </bdi>
      </div>
    </article>
  );
}
