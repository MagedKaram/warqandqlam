import type {
  BindingType,
  PaperSize,
  PaperType,
  PrintFileKind,
  PrintMode,
  PrintingOptions,
} from "@/types/printing";

export type CartCurrency = "LE";

export type ProductCartColor = {
  id: string;
  label: string;
  value: string;
};

export type ProductCartItem = {
  kind: "product";
  id: string;
  productId: string;
  title: string;
  brandName?: string;
  image: string;
  imageAlt: string;
  href: string;
  unitPrice: number;
  currency: CartCurrency;
  quantity: number;
  selectedColor?: ProductCartColor;
  addedAt: string;
};

export type PrintPageCountSource =
  | "detected"
  | "image"
  | "fallback"
  | "legacy";

export type PrintingCartFile = {
  id: string;
  originalName: string;
  extension: PrintFileKind;
  mimeType: string;
  sizeBytes: number;
  pageCount: number;
  pageCountSource: PrintPageCountSource;
};

export type PrintingPriceQuote = {
  version: 1;
  currency: CartCurrency;
  printingSubtotal: number;
  bindingTotal: number;
  total: number;
};

export type PrintingCartItem = {
  kind: "printing";
  id: string;
  files: PrintingCartFile[];
  options: PrintingOptions;
  priceQuote: PrintingPriceQuote;
  addedAt: string;
};

export type CartItem = ProductCartItem | PrintingCartItem;

export type CartState = {
  items: CartItem[];
  couponCode: string | null;
};

export type AddProductCartItemInput = Omit<
  ProductCartItem,
  "addedAt" | "currency" | "id" | "kind" | "quantity"
> & {
  addedAt?: string;
  currency?: CartCurrency;
  id?: string;
  quantity?: number;
};

export type AddPrintingCartItemInput = Omit<
  PrintingCartItem,
  "addedAt" | "id" | "kind"
> & {
  addedAt?: string;
  id?: string;
};

export type PrintingCartAggregate = {
  orderCount: number;
  fileCount: number;
  totalPages: number;
  totalCopies: number;
  totalPrintedPages: number;
  printModes: PrintMode[];
  paperSizes: PaperSize[];
  paperTypes: PaperType[];
  bindingTypes: BindingType[];
};

export type CartTotals = {
  productSubtotal: number;
  printingSubtotal: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  amountUntilFreeShipping: number;
  hasFreeShipping: boolean;
  appliedCouponCode: string | null;
};

export function createEmptyCartState(): CartState {
  return {
    items: [],
    couponCode: null,
  };
}
