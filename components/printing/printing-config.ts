import type {
  BindingType,
  PaperSize,
  PaperType,
  PrintFileKind,
  PrintMode,
  PrintingOptions,
  PricingResult,
} from "@/types/printing";

export const MAX_PRINT_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export const DOC_PAGE_COUNT_FALLBACK = 1;

export const PRINT_ORDER_STORAGE_KEY = "warqandqlam.printOrders";

export const ACCEPTED_PRINT_EXTENSIONS: PrintFileKind[] = [
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
];

export const PRINTING_PRICING = {
  paperSizes: {
    a4: { label: "A4", multiplier: 1 },
    a3: { label: "A3", multiplier: 1.6 },
    a5: { label: "A5", multiplier: 0.75 },
  },
  printModes: {
    color: { label: "ملون", pricePerPage: 2.5 },
    blackWhite: { label: "أبيض واسود", pricePerPage: 0.5 },
  },
  paperTypes: {
    plain80: { label: "عادي (80 جرام)", multiplier: 1 },
    plain100: { label: "عادي (100 جرام)", multiplier: 1.15 },
    coated: { label: "كوشيه", multiplier: 1.45 },
    cardstock: { label: "ورق مقوى", multiplier: 1.8 },
  },
  bindings: {
    none: { label: "بدون تجليد", price: 0 },
    staple: { label: "تدبيس", price: 5 },
    wire: { label: "سلك", price: 25 },
    thermal: { label: "تجليد حراري", price: 35 },
  },
} as const satisfies {
  paperSizes: Record<PaperSize, { label: string; multiplier: number }>;
  printModes: Record<PrintMode, { label: string; pricePerPage: number }>;
  paperTypes: Record<PaperType, { label: string; multiplier: number }>;
  bindings: Record<BindingType, { label: string; price: number }>;
};

export const DEFAULT_PRINTING_OPTIONS: PrintingOptions = {
  paperSize: "a4",
  copies: 1,
  printMode: "color",
  paperType: "plain80",
  binding: "none",
};

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculatePrintingPrice(
  pageCount: number,
  options: PrintingOptions,
): PricingResult {
  const safePageCount = Math.max(0, Number.isFinite(pageCount) ? pageCount : 0);
  const safeCopies = Math.max(1, Number.isFinite(options.copies) ? options.copies : 1);
  const printMode = PRINTING_PRICING.printModes[options.printMode];
  const paperSize = PRINTING_PRICING.paperSizes[options.paperSize];
  const paperType = PRINTING_PRICING.paperTypes[options.paperType];
  const binding = PRINTING_PRICING.bindings[options.binding];

  const printingSubtotal = roundMoney(
    safePageCount *
      safeCopies *
      printMode.pricePerPage *
      paperSize.multiplier *
      paperType.multiplier,
  );
  const bindingTotal = roundMoney(binding.price * safeCopies);

  return {
    pageCount: safePageCount,
    printingSubtotal,
    bindingTotal,
    grandTotal: roundMoney(printingSubtotal + bindingTotal),
  };
}

export function formatPrintPrice(value: number) {
  return `${roundMoney(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  })} LE`;
}
