"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiCaretLeft,
  PiCaretRight,
  PiFileText,
  PiMagnifyingGlassPlus,
  PiX,
} from "react-icons/pi";
import type { UploadedPrintFile } from "@/types/printing";

type FilePreviewModalProps = {
  file: UploadedPrintFile | null;
  onClose: () => void;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])';

function isImageFile(file: UploadedPrintFile) {
  return file.extension === "jpg" || file.extension === "jpeg" || file.extension === "png";
}

function isPdfFile(file: UploadedPrintFile) {
  return file.extension === "pdf";
}

export function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activePage, setActivePage] = useState(1);

  const thumbnailPages = useMemo(() => {
    if (!file) {
      return [];
    }

    return Array.from({ length: Math.min(file.pageCount, 4) }, (_, index) => index + 1);
  }, [file]);

  useEffect(() => {
    if (!file) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
    focusable?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [file, onClose]);

  if (!file) {
    return null;
  }

  const canNavigate = file.pageCount > 1;

  function goPrevious() {
    setActivePage((current) => Math.max(1, current - 1));
  }

  function goNext() {
    setActivePage((current) => Math.min(file?.pageCount ?? 1, current + 1));
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-auth-ink/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        aria-labelledby="print-preview-title"
        aria-modal="true"
        className="mx-auto flex max-h-[calc(100dvh-32px)] w-[calc(100dvw-32px)] max-w-[1100px] min-w-0 flex-col overflow-hidden rounded-[24px] bg-white px-4 py-5 shadow-2xl md:px-10 md:py-8"
        ref={dialogRef}
        role="dialog"
      >
        <div className="flex items-center justify-between gap-6">
          <h2
            className="min-w-0 text-start font-heading text-[24px] font-bold text-auth-ink md:text-[28px]"
            id="print-preview-title"
          >
            معاينة الملف
          </h2>
          <button
            aria-label="إغلاق المعاينة"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-auth-ink transition hover:bg-auth-cream hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
            onClick={onClose}
            type="button"
          >
            <PiX aria-hidden className="text-4xl" />
          </button>
        </div>

        <div className="mx-auto mt-6 min-h-0 w-full max-w-5xl overflow-y-auto overflow-x-hidden">
          <div className="relative min-w-0 overflow-hidden rounded-[20px] bg-cool-200">
            <div className="absolute right-4 top-4 z-10 rounded-full bg-white px-4 py-2 font-body text-[16px] font-semibold text-auth-accent shadow-md">
              معاينة مباشرة
            </div>

            <div className="flex h-[22rem] min-w-0 items-center justify-center overflow-hidden md:h-[30rem]">
              {isImageFile(file) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={file.name}
                  className="h-full w-full object-contain"
                  src={file.objectUrl}
                />
              ) : null}

              {isPdfFile(file) ? (
                <iframe
                  className="h-full w-full bg-white"
                  src={`${file.objectUrl}#page=${activePage}&view=FitH`}
                  title={`معاينة ${file.name}`}
                />
              ) : null}

              {!isImageFile(file) && !isPdfFile(file) ? (
                <div className="mx-auto max-w-xl px-6 text-center">
                  <PiFileText aria-hidden className="mx-auto text-8xl text-auth-muted" />
                  <h3 className="mt-6 font-heading text-3xl font-bold text-auth-ink">
                    لا يمكن عرض هذا الملف داخل المتصفح
                  </h3>
                  <p className="mt-4 font-body text-xl font-semibold leading-9 text-auth-muted">
                    معاينة ملفات Word الكاملة ستتوفر بعد تحويلها من الخادم. يمكنك
                    متابعة الطلب الآن اعتمادا على بيانات الملف المختارة.
                  </p>
                  <p className="mt-4 truncate font-body text-lg font-bold text-auth-ink">
                    {file.name}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 md:bottom-8 md:left-8">
              <button
                aria-label="الصفحة السابقة"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-white transition hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-45 md:h-12 md:w-12"
                disabled={!canNavigate || activePage === 1}
                onClick={goPrevious}
                type="button"
              >
                <PiCaretLeft aria-hidden className="text-3xl" />
              </button>
              <button
                aria-label="الصفحة التالية"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-white transition hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-45 md:h-12 md:w-12"
                disabled={!canNavigate || activePage === file.pageCount}
                onClick={goNext}
                type="button"
              >
                <PiCaretRight aria-hidden className="text-3xl" />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-3 text-white md:bottom-8 md:right-8 md:gap-5">
              <span className="font-body text-[16px] font-semibold md:text-[20px]">
                الصفحة {activePage} من {file.pageCount}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/35 md:h-12 md:w-12">
                <PiMagnifyingGlassPlus aria-hidden className="text-2xl md:text-3xl" />
              </span>
            </div>
          </div>

          <div className="mt-6 flex max-w-full gap-4 overflow-x-auto pb-2">
            {thumbnailPages.map((page) => (
              <button
                aria-label={`عرض الصفحة ${page}`}
                aria-pressed={activePage === page}
                className={`flex aspect-[1.15] w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-[#FAFAFA] text-[18px] font-bold text-auth-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent md:w-44 ${
                  activePage === page
                    ? "border-[3px] border-auth-accent"
                    : "border-[#DFE2E5] hover:border-auth-accent"
                }`}
                key={page}
                onClick={() => setActivePage(page)}
                type="button"
              >
                {isImageFile(file) && page === 1 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    className="h-full w-full object-cover"
                    src={file.objectUrl}
                  />
                ) : (
                  <span>صفحة {page}</span>
                )}
              </button>
            ))}
            {file.pageCount > thumbnailPages.length ? (
              <div className="flex aspect-[1.15] w-36 shrink-0 items-center justify-center rounded-lg border border-dashed border-auth-ink bg-cool-200 text-[22px] font-bold text-auth-ink md:w-44">
                +{file.pageCount - thumbnailPages.length}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
