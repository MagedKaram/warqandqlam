"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PiHeart } from "react-icons/pi";
import { ProductCard } from "@/components/product/ProductCard";
import { wishlistProducts } from "@/lib/mock-data";

function EmptyWishlist() {
  return (
    <section className="flex min-h-[720px] items-center justify-center px-6 py-24 text-center md:px-10">
      <div>
        <PiHeart aria-hidden className="mx-auto text-[9rem] text-auth-muted" />
        <h1 className="mt-8 text-4xl font-bold text-auth-ink md:text-5xl">
          مفضلاتك فارغة
        </h1>
        <p className="mt-5 font-body text-2xl font-bold text-auth-muted">
          لم تقم بالإعجاب بأي منتج بعد
        </p>
        <Link
          className="mt-8 inline-flex h-14 min-w-64 items-center justify-center rounded-md bg-auth-accent px-8 font-body text-xl font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
          href="/products"
          prefetch={false}
        >
          تسوق المنتجات
        </Link>
      </div>
    </section>
  );
}

export function WishlistContent({ forceEmpty }: { forceEmpty: boolean }) {
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const products = useMemo(
    () => wishlistProducts.filter((product) => !removedIds.has(product.id)),
    [removedIds],
  );

  if (forceEmpty || products.length === 0) {
    return (
      <main className="bg-white text-foreground">
        <EmptyWishlist />
      </main>
    );
  }

  return (
    <main className="bg-white px-6 py-20 text-foreground md:px-10">
      <section className="mx-auto min-h-[720px] max-w-7xl">
        <h1 className="text-right text-4xl font-bold text-auth-ink md:text-5xl">
          منتجاتك المفضلة
        </h1>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              isWishlisted
              key={product.id}
              onToggleWishlist={() =>
                setRemovedIds((current) => {
                  const next = new Set(current);
                  next.add(product.id);
                  return next;
                })
              }
              product={product}
              variant="catalog"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
