"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  href?: string;
};

// TODO: replace the repeated test image with real per-slide banner assets.
const slides: HeroSlide[] = [
  {
    id: "printing-discount",
    image: "/assets/images/home/hero.jpg",
    alt: "خصم 20% على كل المطبوعات",
    href: "/products",
  },
  {
    id: "stationery-offer",
    image: "/assets/images/home/hero.jpg",
    alt: "عرض على القرطاسية والكتب",
    href: "/categories",
  },
  {
    id: "school-supplies",
    image: "/assets/images/home/hero.jpg",
    alt: "منتجات مكتبية ومدرسية",
    href: "/products",
  },
];

function normalizeIndex(index: number) {
  return (index + slides.length) % slides.length;
}

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(normalizeIndex(index));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => normalizeIndex(current + 1));
  }, []);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => normalizeIndex(current - 1));
  }, []);

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = window.setInterval(goNext, 5000);
    return () => window.clearInterval(timer);
  }, [goNext, paused]);

  return (
    <section
      aria-label="عروض ورقة وقلم"
      className="group relative w-full overflow-hidden bg-auth-cream"
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="h-56 w-full overflow-hidden sm:h-80 lg:h-auto lg:aspect-[1440/600]">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const image = (
              <Image
                alt={slide.alt}
                className="object-cover"
                fill
                sizes="100vw"
                src={slide.image}
              />
            );

            return (
              <div
                aria-hidden={index !== activeIndex}
                className="relative h-full min-w-full"
                key={slide.id}
              >
                {slide.href ? (
                  <Link
                    aria-label={slide.alt}
                    className="block h-full w-full"
                    href={slide.href}
                    prefetch={false}
                    tabIndex={index === activeIndex ? 0 : -1}
                  >
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        aria-label="الشريحة التالية"
        className="absolute right-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-auth-ink opacity-0 shadow-lg transition hover:bg-white hover:text-auth-accent focus:flex focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-auth-accent group-hover:flex group-hover:opacity-100"
        onClick={goNext}
        type="button"
      >
        <PiCaretRight aria-hidden className="text-3xl" />
      </button>
      <button
        aria-label="الشريحة السابقة"
        className="absolute left-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-auth-ink opacity-0 shadow-lg transition hover:bg-white hover:text-auth-accent focus:flex focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-auth-accent group-hover:flex group-hover:opacity-100"
        onClick={goPrevious}
        type="button"
      >
        <PiCaretLeft aria-hidden className="text-3xl" />
      </button>

      <div
        aria-label="اختيار شريحة العرض"
        className="absolute bottom-0 left-0 right-0 flex gap-1.5 px-2 pb-2"
        dir="rtl"
        role="tablist"
      >
        {slides.map((slide, index) => {
          const active = index === activeIndex;

          return (
            <button
              aria-label={`اعرض ${slide.alt}`}
              aria-selected={active}
              className={`h-2 flex-1 rounded-full transition ${
                active ? "bg-auth-accent" : "bg-auth-border"
              }`}
              key={slide.id}
              onClick={() => goToSlide(index)}
              role="tab"
              type="button"
            />
          );
        })}
      </div>
    </section>
  );
}
