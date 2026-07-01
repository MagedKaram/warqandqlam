"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import type { Product } from "@/types/product";

type ProductCardProps = Pick<
  Product,
  "image" | "title" | "price" | "href" | "currency" | "isNew" | "isWishlisted"
> & {
  onToggleWishlist?: () => void;
};

export function ProductCard({
  image,
  title,
  price,
  href,
  currency = "LE",
  isNew = false,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [internalWishlisted, setInternalWishlisted] = useState(false);
  const wishlisted = isWishlisted ?? internalWishlisted;

  function handleToggleWishlist() {
    if (onToggleWishlist) {
      onToggleWishlist();
      return;
    }

    setInternalWishlisted((current) => !current);
  }

  return (
    <article className="group relative text-right transition duration-300 hover:-translate-y-1">
      <Link
        aria-label={title}
        className="absolute inset-0 z-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-auth-accent focus:ring-offset-4"
        href={href}
        prefetch={false}
      />

      <div className="relative aspect-[297/320] overflow-hidden rounded-lg bg-cool-200">
        {isNew ? (
          <span className="absolute right-4 top-4 z-20 rounded-full bg-auth-success-soft px-3 py-1 text-sm font-semibold text-auth-success">
            منتج جديد
          </span>
        ) : null}

        <button
          aria-label={wishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          aria-pressed={wishlisted}
          className="absolute left-4 top-4 z-20 flex h-8 w-8 items-center justify-center text-auth-ink transition hover:text-auth-accent focus:outline-none focus:ring-2 focus:ring-auth-accent"
          onClick={handleToggleWishlist}
          type="button"
        >
          {wishlisted ? (
            <PiHeartFill aria-hidden className="text-lg text-auth-accent" />
          ) : (
            <PiHeart aria-hidden className="text-lg" />
          )}
        </button>

        <Image
          alt={title}
          className="object-contain p-5 transition duration-500 group-hover:scale-105"
          fill
          sizes="(min-width: 1280px) 297px, (min-width: 1024px) 23vw, (min-width: 640px) 40vw, 78vw"
          src={image}
        />
      </div>

      <div className="px-2 pt-3 text-right">
        <p className="line-clamp-1 font-body text-base font-bold leading-6 text-auth-ink">
          {title}
        </p>
        <p className="mt-0.5 text-right text-xl font-bold leading-7 text-auth-accent" dir="ltr">
          {price} {currency}
        </p>
      </div>
    </article>
  );
}
