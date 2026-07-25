import Link from "next/link";
import { PiShoppingCartSimple } from "react-icons/pi";

export function EmptyCart() {
  return (
    <section className="mx-auto flex min-h-[560px] w-full max-w-3xl items-center justify-center px-4 py-20 text-center">
      <div className="min-w-0">
        <PiShoppingCartSimple
          aria-hidden
          className="mx-auto text-[7rem] text-auth-muted"
        />
        <h1 className="mt-7 font-heading text-4xl font-bold text-auth-ink sm:text-5xl">
          سلة التسوق فارغة
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-base font-semibold leading-8 text-auth-muted sm:text-lg">
          أضف المنتجات أو طلبات الطباعة التي تحتاجها، وستظهر هنا لتتمكن من
          مراجعتها وإتمام الطلب.
        </p>
        <Link
          className="mt-7 inline-flex h-12 min-w-56 items-center justify-center rounded-md bg-auth-accent px-8 font-body text-base font-bold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
          href="/products"
          prefetch={false}
        >
          تسوق المنتجات
        </Link>
      </div>
    </section>
  );
}
