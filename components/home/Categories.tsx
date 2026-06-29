import Image from "next/image";
import Link from "next/link";
import { PiArrowLeft, PiArrowUpLeft } from "react-icons/pi";

type Category = {
  slug: string;
  title?: string;
  image: string;
  alt: string;
  className: string;
};

const categories: Category[] = [
  {
    slug: "engineering-tools",
    title: "ادوات هندسية",
    image: "/assets/images/home/0970376f852e6bac2da6f54a612467bcdf8bc860.jpg",
    alt: "ادوات هندسية",
    className: "lg:col-span-6",
  },
  {
    slug: "pens",
    image: "/assets/images/home/42da388c2d2410b04a781432c9f4662cda0e7bb4.jpg",
    alt: "اقلام",
    className: "lg:col-span-3",
  },
  {
    slug: "highlighters",
    image: "/assets/images/home/46ebafc890e79d420f4898c1d7b101bd604872ea.png",
    alt: "اقلام تحديد",
    className: "lg:col-span-3",
  },
  {
    slug: "notebooks",
    image: "/assets/images/home/74319bbead95c81298ab94642e9aaf991dfcf47e.jpg",
    alt: "دفاتر",
    className: "lg:col-span-3",
  },
  {
    slug: "pencils",
    image: "/assets/images/home/aaec0c79556aa3e629687f2426ad4f31175c67a2.jpg",
    alt: "اقلام رصاص",
    className: "lg:col-span-3",
  },
  {
    slug: "colors",
    title: "الوان",
    image: "/assets/images/home/15fc77b692cc66d7edfa4f01fd4bc56d09fe1ae9.jpg",
    alt: "الوان",
    className: "lg:col-span-6",
  },
];

type CategoryCardProps = {
  image: string;
  title?: string;
  href: string;
  alt: string;
  className?: string;
};

function CategoryCard({ image, title, href, alt, className = "" }: CategoryCardProps) {
  return (
    <Link
      className={`group relative block h-56 overflow-hidden rounded-lg bg-cool-200 ${className}`}
      href={href}
      prefetch={false}
    >
      <Image
        alt={alt}
        className="object-cover transition duration-500 group-hover:scale-105"
        fill
        sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
        src={image}
      />
      {title ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-l from-auth-ink/35 via-transparent to-transparent" />
          <span className="absolute bottom-8 right-8 font-heading text-4xl font-bold text-white">
            {title}
          </span>
          <span className="absolute bottom-8 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-white text-auth-accent shadow-md transition group-hover:bg-auth-accent group-hover:text-white">
            <PiArrowUpLeft aria-hidden className="text-2xl" />
          </span>
        </>
      ) : null}
    </Link>
  );
}

export function Categories() {
  return (
    <section className="bg-white px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-4xl font-bold text-auth-ink md:text-5xl">
            تسوق حسب القسم
          </h2>
          <Link
            className="inline-flex items-center gap-2 text-base font-semibold text-auth-accent hover:underline"
            href="/categories"
            prefetch={false}
          >
            عرض جميع الاقسام
            <PiArrowLeft aria-hidden className="text-xl" />
          </Link>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {categories.map((category) => (
            <CategoryCard
              alt={category.alt}
              className={category.className}
              href={`/categories/${category.slug}`}
              image={category.image}
              key={category.slug}
              title={category.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
