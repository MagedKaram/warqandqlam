export type PrintFileKind = "pdf" | "doc" | "docx" | "jpg" | "jpeg" | "png";

export type PaperSize = "a4" | "a3" | "a5";

export type PrintMode = "color" | "blackWhite";

export type PaperType = "plain80" | "plain100" | "coated" | "cardstock";

export type BindingType = "none" | "staple" | "wire" | "thermal";

export type UploadedPrintFile = {
  id: string;
  file: File;
  name: string;
  extension: PrintFileKind;
  mimeType: string;
  size: number;
  pageCount: number;
  pageCountSource: "detected" | "image" | "fallback";
  objectUrl: string;
};

export type PrintingOptions = {
  paperSize: PaperSize;
  copies: number;
  printMode: PrintMode;
  paperType: PaperType;
  binding: BindingType;
};

export type PricingResult = {
  pageCount: number;
  printingSubtotal: number;
  bindingTotal: number;
  grandTotal: number;
};

export type SavedPrintOrderFile = {
  originalFileName: string;
  fileType: PrintFileKind;
  fileSize: number;
  detectedPageCount: number;
};

export type SavedPrintOrder = {
  id: string;
  createdAt: string;
  files: SavedPrintOrderFile[];
  paperSize: PaperSize;
  copies: number;
  printingMode: PrintMode;
  paperType: PaperType;
  binding: BindingType;
  calculatedSubtotal: number;
  bindingTotal: number;
  grandTotal: number;
};
