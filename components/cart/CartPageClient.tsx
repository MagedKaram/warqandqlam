"use client";

import Link from "next/link";
import { CartItemList } from "@/components/cart/CartItemList";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { RelatedProducts } from "@/components/cart/RelatedProducts";
import { useCart } from "@/components/cart/CartProvider";
import { productDetails } from "@/lib/mock-data";

function CartLoadingState() {
  return (
    <section
      aria-label="جارٍ تحميل السلة"
      className="mx-auto min-h-[560px] w-full max-w-[1240px] animate-pulse px-4 py-16 md:px-6"
    >
      <div className="ms-auto h-12 w-64 max-w-full rounded-md " />
      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="h-72 rounded-lg bg-cool-200" />
        <div className="h-[460px] rounded-lg bg-cool-200" />
      </div>
    </section>
  );
}

export function CartPageClient() {
  const cart = useCart();

  if (!cart.hydrated) {
    return <CartLoadingState />;
  }

  if (cart.state.items.length === 0) {
    return <EmptyCart />;
  }

  const hasProductItems = cart.state.items.some(
    (item) => item.kind === "product",
  );
  const relatedProducts = productDetails[0]?.relatedProducts ?? [];

  return (
    <main className="min-w-0 bg-white text-foreground" data-cart-page>
      <section className="px-4 pb-20 pt-12 md:px-6 md:pt-16">
        <div className="mx-auto w-full min-w-0 max-w-[1240px]">
          <header className="w-full min-w-0 text-start">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-2">
              <h1 className="font-heading text-4xl font-bold text-auth-ink sm:text-5xl">
                سلة التسوق
              </h1>
              <span className="font-body text-base font-semibold text-auth-muted sm:text-lg">
                / لديك <bdi dir="ltr">{cart.lineCount}</bdi>{" "}
                {cart.lineCount === 1 ? "منتج" : "منتجات"} في السلة
              </span>
            </div>
          </header>

          <div className="mt-10 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] xl:grid-cols-[minmax(0,785px)_minmax(0,420px)] xl:gap-[35px]">
            <section
              className="min-w-0 lg:col-start-1 lg:row-start-1"
              aria-label="عناصر السلة"
            >
              <CartItemList
                items={cart.state.items}
                onQuantityChange={cart.updateProductQuantity}
                onRemove={cart.removeItem}
              />
            </section>

            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
              <OrderSummary
                appliedCoupon={cart.appliedCoupon}
                items={cart.state.items}
                onApplyCoupon={cart.setCoupon}
                onRemoveCoupon={() => cart.setCoupon(null)}
                printingAggregate={cart.printingAggregate}
                primaryAction={
                  <Link
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-auth-accent px-6 text-base font-bold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
                    href="/checkout"
                    prefetch={false}
                  >
                    إتمام الطلب
                  </Link>
                }
                secondaryAction={
                  <Link
                    className="inline-flex h-12 w-full items-center justify-center rounded-md border border-auth-ink bg-white px-6 text-base font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
                    href="/products"
                    prefetch={false}
                  >
                    متابعة التسوق
                  </Link>
                }
                totals={cart.totals}
              />
            </div>
          </div>

          {hasProductItems && relatedProducts.length > 0 ? (
            <RelatedProducts
              onAddProduct={cart.addProduct}
              products={relatedProducts}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
