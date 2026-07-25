import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "من نحن | ورقة وقلم",
  description: "تعرف على نموذج واجهة متجر ورقة وقلم وخدماته.",
};

export default function AboutPage() {
  return (
    <main className="bg-white px-6 py-20 text-foreground md:px-10">
      <section className="mx-auto max-w-5xl text-right">
        <span className="inline-flex rounded-md bg-home-promo px-4 py-2 text-sm font-bold text-auth-accent">
          نموذج أولي
        </span>
        <h1 className="mt-6 font-heading text-5xl font-bold leading-tight text-auth-ink md:text-6xl">
          من نحن
        </h1>
        <p className="mt-6 max-w-3xl font-body text-xl font-semibold leading-10 text-auth-muted">
          ورقة وقلم واجهة متجر عربية لمنتجات القرطاسية والكتب وخدمات الطباعة. هذه الصفحة
          جاهزة كجزء من النموذج الأولي للواجهة، وسيتم استبدال النص التعريفي النهائي عند
          اعتماد محتوى العلامة التجارية.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md bg-auth-accent px-6 text-base font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
            href="/products"
            prefetch={false}
          >
            تصفح المنتجات
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md border border-auth-ink px-6 text-base font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
            href="/contact"
            prefetch={false}
          >
            تواصل معنا
          </Link>
        </div>
      </section>
    </main>
  );
}
