"use client";

import { PiEye, PiFileText, PiTrash } from "react-icons/pi";
import type { UploadedPrintFile } from "@/types/printing";

type UploadedFileRowProps = {
  file: UploadedPrintFile;
  onPreview: () => void;
  onRemove: () => void;
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadedFileRow({ file, onPreview, onRemove }: UploadedFileRowProps) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-lg border border-[#DFE2E5] bg-[#FAFAFA] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4 text-right">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-home-promo text-auth-accent">
          <PiFileText aria-hidden className="text-2xl" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-body text-[16px] font-bold leading-6 text-auth-ink">
            {file.name}
          </h3>
          <p className="mt-1 truncate font-body text-[12px] font-semibold text-auth-muted">
            {file.extension.toUpperCase()} · {formatFileSize(file.size)} · {file.pageCount} صفحة
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          aria-label={`معاينة ${file.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#DFE2E5] bg-white text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
          onClick={onPreview}
          type="button"
        >
          <PiEye aria-hidden className="text-xl" />
        </button>
        <button
          aria-label={`حذف ${file.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#DFE2E5] bg-white text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
          onClick={onRemove}
          type="button"
        >
          <PiTrash aria-hidden className="text-xl" />
        </button>
      </div>
    </article>
  );
}
