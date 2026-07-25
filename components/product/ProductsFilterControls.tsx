"use client";

import { useEffect, useState } from "react";
import {
  PiCaretDown,
  PiCheck,
  PiSlidersHorizontal,
  PiX,
} from "react-icons/pi";
import type { ProductFilterGroup } from "@/types/product";

type ProductsFilterControlsProps = {
  filterGroups: ProductFilterGroup[];
};

export function ProductsFilterControls({ filterGroups }: ProductsFilterControlsProps) {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function toggleOption(optionId: string) {
    setSelectedOptions((current) => {
      const next = new Set(current);

      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }

      return next;
    });
  }

  return (
    <>
      <div className="flex items-center gap-8">
        <button
          aria-expanded={open}
          aria-label="فتح الفلاتر"
          className="order-2 flex h-12 w-12 items-center justify-center rounded-md border border-auth-border bg-white text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
          onClick={() => setOpen(true)}
          type="button"
        >
          <PiSlidersHorizontal aria-hidden className="text-2xl" />
        </button>

        <label className="relative order-1 block">
          <span className="sr-only">ترتيب المنتجات</span>
          <select
            className="h-12 min-w-44 appearance-none rounded-md border border-auth-border bg-white py-0 pe-10 ps-4 text-start text-base font-semibold text-auth-muted outline-none transition hover:border-auth-accent focus:border-auth-accent focus:ring-2 focus:ring-auth-accent/20"
            defaultValue="best-selling"
          >
            <option value="best-selling">فرز حسب: الأكثر مبيعاً</option>
            <option value="newest">فرز حسب: الأحدث</option>
            <option value="price-low">السعر: الأقل أولاً</option>
            <option value="price-high">السعر: الأعلى أولاً</option>
          </select>
          <PiCaretDown
            aria-hidden
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-lg text-auth-muted"
          />
        </label>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-auth-ink/55"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <aside className="ml-auto flex h-full w-[23rem] max-w-[88vw] flex-col bg-white px-6 py-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-400 pb-5">
              <h2 className="font-heading text-3xl font-bold text-auth-ink">الفلاتر</h2>
              <button
                aria-label="إغلاق الفلاتر"
                className="flex h-10 w-10 items-center justify-center rounded-md text-auth-ink transition hover:bg-auth-cream hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
                onClick={() => setOpen(false)}
                type="button"
              >
                <PiX aria-hidden className="text-2xl" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto py-2">
              {filterGroups.map((group) => (
                <fieldset className="border-b border-neutral-400 py-6" key={group.id}>
                  <legend className="font-body text-lg font-bold text-auth-ink">
                    {group.title}
                  </legend>

                  <div className="mt-4 grid gap-3">
                    {group.options.map((option) => {
                      const checked = selectedOptions.has(option.id);

                      return (
                        <label
                          className="flex cursor-pointer items-center justify-between gap-4 rounded-md px-1 py-1 text-base font-semibold text-auth-muted transition hover:text-auth-ink"
                          key={option.id}
                        >
                          <span>
                            {option.label}
                            {typeof option.count === "number" ? (
                              <span className="me-2 text-sm text-auth-muted/75">
                                ({option.count})
                              </span>
                            ) : null}
                          </span>
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                              checked
                                ? "border-auth-accent bg-auth-accent text-white"
                                : "border-auth-border bg-white"
                            }`}
                          >
                            {checked ? <PiCheck aria-hidden className="text-sm" /> : null}
                          </span>
                          <input
                            checked={checked}
                            className="sr-only"
                            onChange={() => toggleOption(option.id)}
                            type="checkbox"
                          />
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-neutral-400 pt-5">
              <button
                className="h-12 rounded-md border border-auth-border bg-white text-base font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
                onClick={() => setSelectedOptions(new Set())}
                type="button"
              >
                مسح
              </button>
              <button
                className="h-12 rounded-md bg-auth-accent text-base font-bold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
                onClick={() => setOpen(false)}
                type="button"
              >
                تطبيق
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
