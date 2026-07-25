"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { FilePreviewModal } from "@/components/printing/FilePreviewModal";
import { FileUploadCard } from "@/components/printing/FileUploadCard";
import { OrderSummary } from "@/components/printing/OrderSummary";
import { PrintingOptionsCard } from "@/components/printing/PrintingOptionsCard";
import {
  ACCEPTED_PRINT_EXTENSIONS,
  DEFAULT_PRINTING_OPTIONS,
  DOC_PAGE_COUNT_FALLBACK,
  MAX_PRINT_FILE_SIZE_BYTES,
  calculatePrintingPrice,
} from "@/components/printing/printing-config";
import type { PrintFileKind, UploadedPrintFile } from "@/types/printing";

function getFileExtension(fileName: string): PrintFileKind | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (ACCEPTED_PRINT_EXTENSIONS.includes(extension as PrintFileKind)) {
    return extension as PrintFileKind;
  }

  return null;
}

async function detectPdfPageCount(file: File) {
  const buffer = await file.arrayBuffer();
  const text = new TextDecoder("latin1").decode(buffer);
  const pageMatches = text.match(/\/Type\s*\/Page\b/g);

  if (pageMatches?.length) {
    return pageMatches.length;
  }

  const countMatches = Array.from(text.matchAll(/\/Count\s+(\d+)/g))
    .map((match) => Number(match[1]))
    .filter((count) => Number.isFinite(count) && count > 0);

  return countMatches.length > 0 ? Math.max(...countMatches) : 1;
}

async function getPageCount(file: File, extension: PrintFileKind) {
  if (extension === "jpg" || extension === "jpeg" || extension === "png") {
    return { pageCount: 1, source: "image" as const };
  }

  if (extension === "pdf") {
    try {
      return {
        pageCount: await detectPdfPageCount(file),
        source: "detected" as const,
      };
    } catch {
      return { pageCount: 1, source: "fallback" as const };
    }
  }

  return { pageCount: DOC_PAGE_COUNT_FALLBACK, source: "fallback" as const };
}

function buildFileId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`;
}

export function PrintingPageClient() {
  const { addPrinting } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<UploadedPrintFile[]>([]);
  const lastAddedSignatureRef = useRef<string | null>(null);
  const [files, setFiles] = useState<UploadedPrintFile[]>([]);
  const [options, setOptions] = useState(DEFAULT_PRINTING_OPTIONS);
  const [error, setError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [previewFile, setPreviewFile] = useState<UploadedPrintFile | null>(
    null,
  );

  const totalPageCount = useMemo(
    () => files.reduce((sum, file) => sum + file.pageCount, 0),
    [files],
  );

  const pricing = useMemo(
    () => calculatePrintingPrice(totalPageCount, options),
    [options, totalPageCount],
  );

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => URL.revokeObjectURL(file.objectUrl));
    };
  }, []);

  function openPicker() {
    inputRef.current?.click();
  }

  async function addFiles(fileList: FileList) {
    setError(undefined);
    setSuccessMessage(undefined);

    const nextFiles: UploadedPrintFile[] = [];

    for (const file of Array.from(fileList)) {
      const extension = getFileExtension(file.name);

      if (!extension) {
        setError(
          "صيغة الملف غير مدعومة. الصيغ المتاحة هي PDF و DOC و DOCX و JPG و JPEG و PNG.",
        );
        continue;
      }

      if (file.size > MAX_PRINT_FILE_SIZE_BYTES) {
        setError("حجم الملف أكبر من 50MB. يرجى اختيار ملف أصغر.");
        continue;
      }

      const { pageCount, source } = await getPageCount(file, extension);

      nextFiles.push({
        id: buildFileId(file),
        file,
        name: file.name,
        extension,
        mimeType: file.type,
        size: file.size,
        pageCount,
        pageCountSource: source,
        objectUrl: URL.createObjectURL(file),
      });
    }

    if (nextFiles.length > 0) {
      setFiles((current) => [...current, ...nextFiles]);
    }
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      void addFiles(event.target.files);
    }

    event.target.value = "";
  }

  function removeFile(fileId: string) {
    setFiles((current) => {
      const file = current.find((item) => item.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.objectUrl);
      }

      return current.filter((item) => item.id !== fileId);
    });

    if (previewFile?.id === fileId) {
      setPreviewFile(null);
    }

    setSuccessMessage(undefined);
  }

  function updateOptions(nextOptions: typeof options) {
    setOptions(nextOptions);
    setSuccessMessage(undefined);
  }

  function savePrintOrder() {
    if (files.length === 0) {
      return;
    }

    const signature = JSON.stringify({
      files: files.map((file) => file.id),
      options,
    });

    if (lastAddedSignatureRef.current === signature) {
      setSuccessMessage("طلب الطباعة الحالي موجود بالفعل في سلة التسوق.");
      return;
    }

    addPrinting({
      files: files.map((file) => ({
        id: file.id,
        originalName: file.name,
        extension: file.extension,
        mimeType: file.mimeType,
        sizeBytes: file.size,
        pageCount: file.pageCount,
        pageCountSource: file.pageCountSource,
      })),
      options,
      priceQuote: {
        version: 1,
        currency: "LE",
        printingSubtotal: pricing.printingSubtotal,
        bindingTotal: pricing.bindingTotal,
        total: pricing.grandTotal,
      },
    });

    lastAddedSignatureRef.current = signature;
    setSuccessMessage("تمت إضافة طلب الطباعة إلى سلة التسوق.");
  }

  return (
    <section className="overflow-x-hidden px-4 pb-20 pt-8 md:px-6 md:pt-12 lg:px-0 lg:pt-16">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,773px)_minmax(0,416px)] lg:gap-[51px]">
        <div className="grid min-w-0 self-start gap-6 lg:col-start-1 lg:row-start-1">
          <FileUploadCard
            error={error}
            files={files}
            inputRef={inputRef}
            onFileInputChange={handleFileInputChange}
            onFilesDropped={(droppedFiles) => void addFiles(droppedFiles)}
            onOpenPicker={openPicker}
            onPreview={setPreviewFile}
            onRemove={removeFile}
          />
          <PrintingOptionsCard options={options} onChange={updateOptions} />
        </div>

        <div className="min-w-0 self-start lg:col-start-2 lg:row-start-1">
          <OrderSummary
            canAddToCart={files.length > 0}
            pricing={pricing}
            successMessage={successMessage}
            onAddToCart={savePrintOrder}
          />
        </div>
      </div>

      <FilePreviewModal
        file={previewFile}
        key={previewFile?.id ?? "print-preview-empty"}
        onClose={() => setPreviewFile(null)}
      />
    </section>
  );
}
