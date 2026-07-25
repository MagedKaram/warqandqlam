import Image from "next/image";
import Link from "next/link";
import { categoryListItems } from "@/lib/mock-data";

export default function CategoriesPage() {
  return (
    <main className="bg-white px-6 pb-40 pt-14 text-foreground md:px-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-right text-4xl font-bold text-auth-ink md:text-5xl">
          الأقسام
        </h1>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {categoryListItems.map((category) => (
            <Link
              className="group flex min-h-52 flex-col items-center justify-center rounded-lg border border-auth-border/45 bg-white px-6 py-6 text-center transition hover:-translate-y-1 hover:border-auth-accent/50 hover:shadow-[0_18px_42px_rgba(11,32,54,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
              href={`/categories/${category.slug}`}
              key={category.id}
              prefetch={false}
            >
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-cool-200">
                <Image
                  alt={category.title}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  fill
                  sizes="112px"
                  src={category.image}
                />
              </div>

              <h2 className="mt-5 font-body text-2xl font-bold leading-8 text-auth-ink">
                {category.title}
              </h2>
              <p className="mt-2 font-body text-lg font-bold leading-7 text-auth-muted">
                {category.description ?? `يوجد ${category.productCount} منتجات`}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
