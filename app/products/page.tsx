import type { Metadata } from "next";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { SchoolPromo } from "@/components/home/SchoolPromo";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductsFilterControls } from "@/components/product/ProductsFilterControls";
import { productFilterGroups, productsPageProducts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "المنتجات | ورقة وقلم",
  description: "تسوق منتجات القرطاسية والأدوات المدرسية من ورقة وقلم.",
};

const paginationItems = ["1", "2", "...", "23", "24"];

export default function ProductsPage() {
  return (
    <main className="bg-white text-foreground">
      <SchoolPromo
        ctaHref="#products-grid"
        headingLevel="h1"
        imageHeight={500}
        imageSrc="/assets/images/products/school-supplies-banner.png"
        imageWidth={620}
        priority
      />

      <section className="px-6 pb-36 pt-16 md:px-10 lg:pb-40" id="products-grid">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8">
            <h2 className="text-right font-heading text-5xl font-bold leading-tight text-auth-ink md:text-6xl">
              المنتجات
            </h2>

            <ProductsFilterControls filterGroups={productFilterGroups} />
          </div>

          <div className="mt-9 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {productsPageProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="catalog"
              />
            ))}
          </div>

          <nav
            aria-label="ترقيم صفحات المنتجات"
            className="mt-16 flex justify-center"
            dir="ltr"
          >
            <div className="flex h-11 items-center rounded-md border border-neutral-400 bg-white px-3">
              <button
                aria-label="الصفحة السابقة"
                className="flex h-9 w-9 items-center justify-center rounded-md text-auth-muted transition hover:bg-cool-200 hover:text-auth-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
                type="button"
              >
                <PiCaretLeft aria-hidden className="text-lg" />
              </button>

              {paginationItems.map((item) =>
                item === "..." ? (
                  <span
                    className="flex h-9 min-w-10 items-center justify-center text-sm font-bold text-auth-muted"
                    key={item}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    aria-current={item === "1" ? "page" : undefined}
                    className={`flex h-9 min-w-10 items-center justify-center rounded-md text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent ${
                      item === "1"
                        ? "bg-cool-200 text-auth-ink"
                        : "text-auth-muted hover:bg-cool-200 hover:text-auth-ink"
                    }`}
                    key={item}
                    type="button"
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                aria-label="الصفحة التالية"
                className="flex h-9 w-9 items-center justify-center rounded-md text-auth-muted transition hover:bg-cool-200 hover:text-auth-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
                type="button"
              >
                <PiCaretRight aria-hidden className="text-lg" />
              </button>
            </div>
          </nav>
        </div>
      </section>
    </main>
  );
}
