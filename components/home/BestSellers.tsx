"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { ProductCard } from "@/components/product/ProductCard";
import { bestSellerProducts } from "@/lib/mock-data";

export function BestSellers() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  function scrollByCard(direction: "next" | "previous") {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const firstCard = carousel.querySelector<HTMLElement>("[data-product-card]");
    const amount = firstCard ? firstCard.offsetWidth + 24 : carousel.clientWidth * 0.8;

    carousel.scrollBy({
      left: direction === "next" ? -amount : amount,
      behavior: "smooth",
    });
  }

  function toggleWishlist(productId: string) {
    setWishlistedIds((current) => {
      const next = new Set(current);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  }

  return (
    <section className="bg-white px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(14rem,18rem)_1fr] lg:items-start">
        <div className="flex items-center justify-between gap-6 lg:block">
          <h2 className="text-4xl font-bold text-auth-ink md:text-5xl">
            الاكثر مبيعا
          </h2>

          <div className="mt-0 flex items-center gap-7 lg:mt-12">
            <button
              aria-label="المنتجات التالية"
              className="flex h-8 w-8 items-center justify-center text-auth-muted transition hover:text-auth-ink focus:outline-none focus:ring-2 focus:ring-auth-accent"
              onClick={() => scrollByCard("next")}
              type="button"
            >
              <PiArrowLeft aria-hidden className="text-3xl" />
            </button>
            <button
              aria-label="المنتجات السابقة"
              className="flex h-8 w-8 items-center justify-center text-auth-muted transition hover:text-auth-ink focus:outline-none focus:ring-2 focus:ring-auth-accent"
              onClick={() => scrollByCard("previous")}
              type="button"
            >
              <PiArrowRight aria-hidden className="text-3xl" />
            </button>
          </div>

          <Link
            className="mt-16 hidden items-center gap-2 text-base font-semibold text-auth-accent hover:underline lg:inline-flex"
            href="/products"
            prefetch={false}
          >
            عرض جميع المنتجات
            <PiArrowLeft aria-hidden className="text-xl" />
          </Link>
        </div>

        <div className="min-w-0">
          <div
            className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            dir="rtl"
            ref={carouselRef}
          >
            {bestSellerProducts.map((product) => (
              <div
                className="min-w-[72%] snap-start sm:min-w-[43%] lg:min-w-[calc((100%_-_72px)/4)]"
                data-product-card
                key={product.id}
              >
                <ProductCard
                  {...product}
                  isWishlisted={wishlistedIds.has(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                />
              </div>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-auth-accent hover:underline lg:hidden"
            href="/products"
            prefetch={false}
          >
            عرض جميع المنتجات
            <PiArrowLeft aria-hidden className="text-xl" />
          </Link>
        </div>
      </div>
    </section>
  );
}
