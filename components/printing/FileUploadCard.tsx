"use client";

import { ChangeEvent, DragEvent, KeyboardEvent, RefObject, useState } from "react";
import { PiCloudArrowUp, PiUploadSimple } from "react-icons/pi";
import type { UploadedPrintFile } from "@/types/printing";
import { UploadedFileRow } from "@/components/printing/UploadedFileRow";

type FileUploadCardProps = {
  files: UploadedPrintFile[];
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onFileInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilesDropped: (files: FileList) => void;
  onOpenPicker: () => void;
  onPreview: (file: UploadedPrintFile) => void;
  onRemove: (fileId: string) => void;
};

export function FileUploadCard({
  error,
  files,
  inputRef,
  onFileInputChange,
  onFilesDropped,
  onOpenPicker,
  onPreview,
  onRemove,
}: FileUploadCardProps) {
  const [dragActive, setDragActive] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setDragActive(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    if (event.dataTransfer.files.length > 0) {
      onFilesDropped(event.dataTransfer.files);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenPicker();
    }
  }

  return (
    <section className="w-full min-w-0 rounded-[16px] border border-[#DFE2E5] bg-white p-4 shadow-sm md:p-6">
      <h2 className="w-full text-start font-heading text-[24px] font-bold leading-[1.3] text-auth-ink">
        ارفع الملفات
      </h2>

      <input
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
        className="sr-only"
        multiple
        onChange={onFileInputChange}
        ref={inputRef}
        type="file"
      />

      <div
        aria-describedby="printing-upload-help"
        aria-label="منطقة رفع ملفات الطباعة"
        className={`mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed px-4 py-8 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 md:min-h-64 ${
          dragActive
            ? "border-auth-accent bg-home-promo"
            : "border-[#DFE2E5] bg-[#FAFAFA] hover:border-auth-accent"
        }`}
        onClick={onOpenPicker}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <PiCloudArrowUp aria-hidden className="text-4xl text-[#6D7379] md:text-5xl" />
        <p className="mt-4 font-heading text-[22px] font-bold leading-[1.3] text-auth-ink md:text-[24px]">
          اسحب وافلت الملفات هنا
        </p>
        <p className="mt-2 font-body text-[15px] font-semibold leading-[1.4] text-auth-muted md:text-[16px]">
          أو اضغط لاختيار الملفات من جهازك
        </p>
        <button
          className="mt-5 inline-flex h-12 w-full max-w-64 items-center justify-center gap-2 rounded-md bg-auth-accent px-6 font-body text-[18px] font-bold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 sm:w-auto sm:min-w-64"
          onClick={(event) => {
            event.stopPropagation();
            onOpenPicker();
          }}
          type="button"
        >
          اختر الملفات
          <PiUploadSimple aria-hidden className="text-2xl" />
        </button>
        <p className="mt-4 max-w-full font-body text-[12px] font-semibold leading-6 text-auth-muted" id="printing-upload-help">
          الصيغ المدعومة: PDF, DOC, DOCX, JPG, PNG (حجم أقصى: 50MB)
        </p>
      </div>

      {error ? (
        <p className="mt-4 text-start text-base font-semibold text-auth-accent" role="alert">
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <div className="mt-6 space-y-3">
          {files.map((file) => (
            <UploadedFileRow
              file={file}
              key={file.id}
              onPreview={() => onPreview(file)}
              onRemove={() => onRemove(file.id)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
