"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  PiHeart,
  PiHeartFill,
  PiShoppingCartSimple,
  PiStarFill,
} from "react-icons/pi";
import { formatCartMoney } from "@/lib/cart/cart-calculations";
import type { ProductCardProduct } from "@/types/product";

export type ProductCardVariant = "recommendation" | "catalog";

export type ProductCardProps = {
  product: ProductCardProduct;
  variant?: ProductCardVariant;
  imagePriority?: boolean;
  className?: string;
  showWishlist?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  onAddToCart?: () => void;
  addToCartDisabled?: boolean;
};

function formatProductMoney(value: number, currency = "LE") {
  if (currency === "LE") {
    return formatCartMoney(value);
  }

  const safeValue = Number.isFinite(value) ? value : 0;
  return `${safeValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(safeValue) ? 0 : 1,
  })} ${currency}`;
}

export function ProductCard({
  addToCartDisabled = false,
  className = "",
  imagePriority = false,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  product,
  showWishlist = true,
  variant = "recommendation",
}: ProductCardProps) {
  const [internalWishlisted, setInternalWishlisted] = useState(
    product.isWishlisted ?? false,
  );
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted ?? internalWishlisted;
  const isRecommendation = variant === "recommendation";
  const badgeLabel = product.badge ?? (product.isNew ? "منتج جديد" : null);
  const badgeTone = product.badgeTone ?? "success";
  const rating =
    product.rating === undefined
      ? undefined
      : Math.min(5, Math.max(0, product.rating));
  const addDisabled =
    addToCartDisabled || product.isAvailable === false || !onAddToCart;

  function handleToggleWishlist() {
    if (onToggleWishlist) {
      onToggleWishlist();
      return;
    }

    setInternalWishlisted((current) => !current);
  }

  function handleAddToCart() {
    if (addDisabled || !onAddToCart) {
      return;
    }

    onAddToCart();
    setAdded(true);
  }

  return (
    <article
      className={`group relative min-w-0 ${
        isRecommendation
          ? "flex flex-col rounded-lg border border-neutral-400 bg-white p-4"
          : "text-start transition duration-300 hover:-translate-y-1"
      } ${className}`}
      data-product-card
    >
      {badgeLabel ? (
        <span
          className={`absolute start-4 top-4 z-20 rounded-full px-3 py-1 font-bold ${
            isRecommendation ? "text-xs" : "text-sm"
          } ${
            badgeTone === "success"
              ? "bg-auth-success-soft text-auth-success"
              : "bg-home-promo text-auth-accent"
          }`}
        >
          {badgeLabel}
        </span>
      ) : null}

      {showWishlist ? (
        <button
          aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          aria-pressed={wishlisted}
          className={`absolute end-4 top-4 z-30 flex items-center justify-center bg-white text-auth-ink transition hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent ${
            isRecommendation ? "h-9 w-9 rounded-full" : "h-8 w-8"
          }`}
          onClick={handleToggleWishlist}
          type="button"
        >
          {wishlisted ? (
            <PiHeartFill
              aria-hidden
              className={`${isRecommendation ? "text-xl" : "text-lg"} text-auth-accent`}
            />
          ) : (
            <PiHeart
              aria-hidden
              className={isRecommendation ? "text-xl" : "text-lg"}
            />
          )}
        </button>
      ) : null}

      <Link
        aria-label={`عرض ${product.title}`}
        className={`block min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent ${
          isRecommendation ? "" : "focus-visible:ring-offset-4"
        }`}
        href={product.href}
        prefetch={false}
      >
        <div
          className={`relative w-full overflow-hidden bg-cool-200 ${
            isRecommendation
              ? "h-52 rounded-md"
              : "aspect-[297/320] rounded-lg"
          }`}
        >
          <Image
            alt={product.imageAlt ?? product.title}
            className={`object-contain ${
              isRecommendation
                ? "p-4"
                : "p-5 transition duration-500 group-hover:scale-105"
            }`}
            fill
            preload={imagePriority}
            sizes={
              isRecommendation
                ? "(min-width: 1280px) 280px, (min-width: 640px) 45vw, 90vw"
                : "(min-width: 1280px) 297px, (min-width: 1024px) 23vw, (min-width: 640px) 40vw, 78vw"
            }
            src={product.image}
          />
        </div>

        {isRecommendation ? (
          <h3 className="mt-4 line-clamp-2 min-h-12 text-start font-body text-base font-bold leading-6 text-auth-ink">
            {product.title}
          </h3>
        ) : (
          <p className="line-clamp-1 px-2 pt-3 font-body text-base font-bold leading-6 text-auth-ink">
            {product.title}
          </p>
        )}

        <div
          className={`flex min-w-0 items-center gap-3 ${
            isRecommendation ? "mt-1" : "px-2 pt-0.5"
          }`}
        >
          <bdi
            className={`block shrink-0 whitespace-nowrap font-bold ${
              isRecommendation
                ? "text-lg text-auth-ink"
                : "text-xl leading-7 text-auth-accent"
            }`}
            dir="ltr"
          >
            {formatProductMoney(product.price, product.currency)}
          </bdi>

          {product.oldPrice !== undefined ? (
            <bdi
              className="shrink-0 whitespace-nowrap text-sm font-semibold text-auth-muted line-through"
              dir="ltr"
            >
              {formatProductMoney(product.oldPrice, product.currency)}
            </bdi>
          ) : null}
        </div>

        {isRecommendation && rating !== undefined ? (
          <div
            aria-label={`التقييم ${rating} من 5${
              product.reviewCount !== undefined
                ? `، ${product.reviewCount} مراجعة`
                : ""
            }`}
            className="mt-2 flex items-center gap-1 text-amber-400"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <PiStarFill
                aria-hidden
                className={index < rating ? "" : "text-auth-border"}
                key={index}
              />
            ))}
            {product.reviewCount !== undefined ? (
              <bdi
                className="ms-1 text-sm font-semibold text-auth-muted"
                dir="ltr"
              >
                {product.reviewCount}
              </bdi>
            ) : null}
          </div>
        ) : null}
      </Link>

      {isRecommendation ? (
        <button
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-auth-accent px-4 text-base font-bold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={addDisabled}
          onClick={handleAddToCart}
          type="button"
        >
          <PiShoppingCartSimple aria-hidden className="text-xl" />
          {product.isAvailable === false
            ? "غير متوفر حاليًا"
            : added
              ? "تمت الإضافة"
              : "أضف للسلة"}
        </button>
      ) : null}
    </article>
  );
}
