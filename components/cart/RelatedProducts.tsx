"use client";

import Link from "next/link";
import { PiArrowLeft } from "react-icons/pi";
import { ProductCard } from "@/components/product/ProductCard";
import { createProductCardCartInput } from "@/lib/cart/product-card-adapter";
import type { AddProductCartItemInput } from "@/types/cart";
import type { RelatedProduct } from "@/types/product";

type RelatedProductsProps = {
  products: RelatedProduct[];
  onAddProduct: (input: AddProductCartItemInput) => string;
};

export function RelatedProducts({
  onAddProduct,
  products,
}: RelatedProductsProps) {
  return (
    <section className="mt-16 min-w-0" aria-labelledby="cart-related-title">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
        <h2
          className="text-start font-heading text-3xl font-bold text-auth-ink sm:text-4xl"
          id="cart-related-title"
        >
          منتجات ذات صلة
        </h2>
        <Link
          className="inline-flex items-center gap-2 text-base font-bold text-auth-accent transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
          href="/products"
          prefetch={false}
        >
          عرض جميع المنتجات
          <PiArrowLeft aria-hidden className="text-xl" />
        </Link>
      </div>

      <div className="mt-7 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            onAddToCart={() => {
              onAddProduct(createProductCardCartInput(product));
            }}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
