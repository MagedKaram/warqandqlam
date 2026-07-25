import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryListItems } from "@/lib/mock-data";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return categoryListItems.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryListItems.find((item) => item.slug === slug);

  if (!category) {
    return {
      title: "القسم غير موجود | ورقة وقلم",
    };
  }

  return {
    title: `${category.title} | ورقة وقلم`,
    description: category.description ?? `تصفح منتجات ${category.title} من ورقة وقلم.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categoryListItems.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="bg-white px-6 py-20 text-foreground md:px-10">
      <section className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[28rem_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-cool-200">
          <Image
            alt={category.title}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 28rem, 90vw"
            src={category.image}
          />
        </div>

        <div className="text-right">
          <span className="inline-flex rounded-md bg-home-promo px-4 py-2 text-sm font-bold text-auth-accent">
            قسم المنتجات
          </span>
          <h1 className="mt-6 font-heading text-5xl font-bold leading-tight text-auth-ink md:text-6xl">
            {category.title}
          </h1>
          <p className="mt-5 max-w-3xl font-body text-xl font-semibold leading-10 text-auth-muted">
            {category.description ??
              `يوجد ${category.productCount} منتجات في هذا القسم ضمن بيانات النموذج الأولي.`}
          </p>
          <p className="mt-4 font-body text-lg font-bold text-auth-ink">
            عدد المنتجات التجريبي: {category.productCount}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md bg-auth-accent px-6 text-base font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
              href="/products"
              prefetch={false}
            >
              عرض كل المنتجات
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md border border-auth-ink px-6 text-base font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
              href="/categories"
              prefetch={false}
            >
              كل الأقسام
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
