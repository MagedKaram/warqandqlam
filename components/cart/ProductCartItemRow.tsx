"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  PiHeart,
  PiHeartFill,
  PiTrash,
  PiTruck,
} from "react-icons/pi";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatCartMoney } from "@/lib/cart/cart-calculations";
import type { ProductCartItem } from "@/types/cart";

type ProductCartItemRowProps = {
  item: ProductCartItem;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
};

export function ProductCartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: ProductCartItemRowProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article
      className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-lg border border-neutral-400 bg-white p-4 sm:grid-cols-[112px_minmax(0,1fr)_48px] sm:gap-5 sm:p-5"
      data-cart-item-kind="product"
    >
      <Link
        aria-label={`عرض ${item.title}`}
        className="relative col-start-1 row-start-1 h-28 w-[88px] overflow-hidden rounded-lg bg-cool-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 sm:h-32 sm:w-28"
        href={item.href}
        prefetch={false}
      >
        <Image
          alt={item.imageAlt}
          className="object-contain p-2"
          fill
          sizes="112px"
          src={item.image}
        />
      </Link>

      <div className="col-start-2 row-start-1 min-w-0">
        <Link
          className="block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
          href={item.href}
          prefetch={false}
        >
          <h2 className="w-full min-w-0 text-start font-body text-lg font-bold leading-8 text-auth-ink sm:text-xl">
            <span>{item.title}</span>
            {item.brandName ? (
              <>
                {" "}
                <bdi className="whitespace-nowrap" dir="ltr">
                  {item.brandName}
                </bdi>
              </>
            ) : null}
          </h2>
        </Link>

        {item.selectedColor ? (
          <p className="mt-1 text-start text-sm font-semibold text-auth-muted">
            اللون: {item.selectedColor.label}
          </p>
        ) : null}

        <p className="mt-3 flex min-w-0 items-center gap-2 text-start text-sm font-semibold leading-6 text-auth-success sm:text-base">
          <PiTruck aria-hidden className="shrink-0 text-2xl" />
          <span className="min-w-0">يصل خلال 2–5 أيام عمل</span>
        </p>

        <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-4">
          <bdi
            className="shrink-0 whitespace-nowrap font-heading text-xl font-bold text-auth-accent"
            dir="ltr"
          >
            {formatCartMoney(item.unitPrice * item.quantity)}
          </bdi>

          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => onQuantityChange(item.id, quantity)}
          />
        </div>
      </div>

      <div className="col-span-2 col-start-1 row-start-2 flex items-center justify-between gap-3 border-t border-neutral-400 pt-3 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:flex-col sm:border-0 sm:pt-0">
        <button
          aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          aria-pressed={wishlisted}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-auth-ink shadow-[0_4px_16px_rgba(11,32,54,0.12)] transition hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
          onClick={() => setWishlisted((current) => !current)}
          type="button"
        >
          {wishlisted ? (
            <PiHeartFill aria-hidden className="text-xl text-auth-accent" />
          ) : (
            <PiHeart aria-hidden className="text-xl" />
          )}
        </button>

        <button
          aria-label={`إزالة ${item.title} من السلة`}
          className="flex h-11 w-11 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          onClick={() => onRemove(item.id)}
          type="button"
        >
          <PiTrash aria-hidden className="text-2xl" />
        </button>
      </div>
    </article>
  );
}
