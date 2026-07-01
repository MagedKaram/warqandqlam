"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { PiArrowLeft, PiArrowRight, PiStarFill } from "react-icons/pi";
import { testimonials, type Testimonial } from "@/lib/mock-data";

function normalizeIndex(index: number) {
  return (index + testimonials.length) % testimonials.length;
}

function getCardOffset(index: number, activeIndex: number) {
  const total = testimonials.length;
  const rawOffset = index - activeIndex;

  if (rawOffset > total / 2) {
    return rawOffset - total;
  }

  if (rawOffset < -total / 2) {
    return rawOffset + total;
  }

  return rawOffset;
}

function TestimonialCard({
  testimonial,
  offset,
}: {
  testimonial: Testimonial;
  offset: number;
}) {
  const isActive = offset === 0;
  const clampedOffset = Math.max(-1, Math.min(1, offset));

  return (
    <article
      aria-hidden={!isActive}
      className={`absolute left-1/2 top-0 w-full max-w-4xl rounded-lg border border-auth-border/40 bg-white px-6 py-10 text-center shadow-[0_22px_55px_rgba(11,32,54,0.10)] transition-all duration-700 ease-out md:px-20 ${
        isActive ? "z-20 opacity-100" : "z-10 opacity-0"
      }`}
      style={{
        pointerEvents: isActive ? "auto" : "none",
        transform: `translateX(calc(-50% + ${clampedOffset * 22}%)) translateY(${
          isActive ? 0 : 32
        }px) scale(${isActive ? 1 : 0.94})`,
      }}
    >
      <div className="flex justify-center gap-2 text-auth-accent">
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <PiStarFill aria-hidden className="text-xl" key={index} />
        ))}
      </div>

      <blockquote className="mx-auto mt-7 max-w-3xl font-body text-2xl font-bold leading-10 text-auth-ink">
        &quot;{testimonial.quote}&quot;
      </blockquote>

      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="text-left">
          <p className="font-body text-2xl font-bold text-auth-ink">
            {testimonial.name}
          </p>
          <p className="mt-1 text-base font-semibold text-auth-muted">
            {testimonial.role}
          </p>
        </div>
        <Image
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover"
          height={48}
          src={testimonial.avatar}
          width={48}
        />
      </div>
    </article>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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

    const timer = window.setInterval(goNext, 2000);
    return () => window.clearInterval(timer);
  }, [goNext, paused]);

  return (
    <section
      className="overflow-hidden bg-white px-6 py-24 md:px-10"
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-auth-ink md:text-5xl">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="mt-4 text-lg font-semibold text-auth-ink">
            آراء حقيقية من عملاء راضين
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute inset-x-8 top-10 hidden h-[260px] rounded-lg bg-home-promo md:block" />

          <div className="relative mx-auto h-[360px] max-w-4xl md:h-[310px]">
            {testimonials.map((testimonial, index) => {
              const offset = getCardOffset(index, activeIndex);

              if (Math.abs(offset) > 1) {
                return null;
              }

              return (
                <TestimonialCard
                  key={testimonial.id}
                  offset={offset}
                  testimonial={testimonial}
                />
              );
            })}
          </div>

          <button
            aria-label="رأي العميل التالي"
            className="absolute -left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-auth-muted transition hover:text-auth-ink focus:outline-none focus:ring-2 focus:ring-auth-accent md:flex"
            onClick={goNext}
            type="button"
          >
            <PiArrowLeft aria-hidden className="text-3xl" />
          </button>
          <button
            aria-label="رأي العميل السابق"
            className="absolute -right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-auth-muted transition hover:text-auth-ink focus:outline-none focus:ring-2 focus:ring-auth-accent md:flex"
            onClick={goPrevious}
            type="button"
          >
            <PiArrowRight aria-hidden className="text-3xl" />
          </button>

          <div className="mt-8 flex justify-center gap-3 md:hidden">
            <button
              aria-label="رأي العميل التالي"
              className="flex h-11 w-11 items-center justify-center text-auth-muted transition hover:text-auth-ink focus:outline-none focus:ring-2 focus:ring-auth-accent"
              onClick={goNext}
              type="button"
            >
              <PiArrowLeft aria-hidden className="text-3xl" />
            </button>
            <button
              aria-label="رأي العميل السابق"
              className="flex h-11 w-11 items-center justify-center text-auth-muted transition hover:text-auth-ink focus:outline-none focus:ring-2 focus:ring-auth-accent"
              onClick={goPrevious}
              type="button"
            >
              <PiArrowRight aria-hidden className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
