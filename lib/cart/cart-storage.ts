import {
  CART_STORAGE_KEY,
  CART_STORAGE_VERSION,
  LEGACY_PRINT_ORDER_STORAGE_KEY,
} from "@/lib/cart/cart-config";
import type {
  CartItem,
  CartState,
  CartTotals,
  PrintingCartFile,
  PrintingCartItem,
  PrintingPriceQuote,
  ProductCartColor,
  ProductCartItem,
} from "@/types/cart";
import { createEmptyCartState } from "@/types/cart";
import type {
  BindingType,
  PaperSize,
  PaperType,
  PrintFileKind,
  PrintMode,
  PrintingOptions,
} from "@/types/printing";

export type PersistedCartV1 = {
  version: typeof CART_STORAGE_VERSION;
  cart: CartState;
};

export type CartStorageLoadResult = {
  state: CartState;
  source: "current" | "empty" | "legacy" | "recovered" | "unavailable";
  migratedLegacyItemCount: number;
};

const printFileKinds = ["pdf", "doc", "docx", "jpg", "jpeg", "png"] as const;
const paperSizes = ["a4", "a3", "a5"] as const;
const printModes = ["color", "blackWhite"] as const;
const paperTypes = ["plain80", "plain100", "coated", "cardstock"] as const;
const bindingTypes = ["none", "staple", "wire", "thermal"] as const;
const pageCountSources = ["detected", "image", "fallback", "legacy"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isOneOf<Value extends string>(
  value: unknown,
  allowedValues: readonly Value[],
): value is Value {
  return typeof value === "string" && allowedValues.includes(value as Value);
}

function isProductCartColor(value: unknown): value is ProductCartColor {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.label) &&
    isNonEmptyString(value.value)
  );
}

function isProductCartItem(value: unknown): value is ProductCartItem {
  return (
    isRecord(value) &&
    value.kind === "product" &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.productId) &&
    isNonEmptyString(value.title) &&
    (value.brandName === undefined || isNonEmptyString(value.brandName)) &&
    typeof value.image === "string" &&
    typeof value.imageAlt === "string" &&
    isNonEmptyString(value.href) &&
    isNonNegativeNumber(value.unitPrice) &&
    value.currency === "LE" &&
    isPositiveInteger(value.quantity) &&
    (value.selectedColor === undefined || isProductCartColor(value.selectedColor)) &&
    isNonEmptyString(value.addedAt)
  );
}

function isPrintingCartFile(value: unknown): value is PrintingCartFile {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.originalName) &&
    isOneOf(value.extension, printFileKinds) &&
    typeof value.mimeType === "string" &&
    isNonNegativeInteger(value.sizeBytes) &&
    isPositiveInteger(value.pageCount) &&
    isOneOf(value.pageCountSource, pageCountSources)
  );
}

function isPrintingOptions(value: unknown): value is PrintingOptions {
  return (
    isRecord(value) &&
    isOneOf(value.paperSize, paperSizes) &&
    isPositiveInteger(value.copies) &&
    isOneOf(value.printMode, printModes) &&
    isOneOf(value.paperType, paperTypes) &&
    isOneOf(value.binding, bindingTypes)
  );
}

function isPrintingPriceQuote(value: unknown): value is PrintingPriceQuote {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    value.currency !== "LE" ||
    !isNonNegativeNumber(value.printingSubtotal) ||
    !isNonNegativeNumber(value.bindingTotal) ||
    !isNonNegativeNumber(value.total)
  ) {
    return false;
  }

  const expectedTotal = value.printingSubtotal + value.bindingTotal;
  return Math.abs(expectedTotal - value.total) < 0.011;
}

function isPrintingCartItem(value: unknown): value is PrintingCartItem {
  return (
    isRecord(value) &&
    value.kind === "printing" &&
    isNonEmptyString(value.id) &&
    Array.isArray(value.files) &&
    value.files.length > 0 &&
    value.files.every(isPrintingCartFile) &&
    isPrintingOptions(value.options) &&
    isPrintingPriceQuote(value.priceQuote) &&
    isNonEmptyString(value.addedAt)
  );
}

export function isCartItem(value: unknown): value is CartItem {
  return isProductCartItem(value) || isPrintingCartItem(value);
}

export function isCartState(value: unknown): value is CartState {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    !value.items.every(isCartItem) ||
    !(value.couponCode === null || typeof value.couponCode === "string")
  ) {
    return false;
  }

  const itemIds = new Set(value.items.map((item) => item.id));
  return itemIds.size === value.items.length;
}

export function isCartTotals(value: unknown): value is CartTotals {
  if (
    !isRecord(value) ||
    !isNonNegativeNumber(value.productSubtotal) ||
    !isNonNegativeNumber(value.printingSubtotal) ||
    !isNonNegativeNumber(value.subtotal) ||
    !isNonNegativeNumber(value.discount) ||
    !isNonNegativeNumber(value.shipping) ||
    !isNonNegativeNumber(value.total) ||
    !isNonNegativeNumber(value.amountUntilFreeShipping) ||
    typeof value.hasFreeShipping !== "boolean" ||
    !(
      value.appliedCouponCode === null ||
      typeof value.appliedCouponCode === "string"
    )
  ) {
    return false;
  }

  const expectedSubtotal = value.productSubtotal + value.printingSubtotal;
  const expectedTotal = Math.max(0, value.subtotal - value.discount) + value.shipping;

  return (
    value.discount <= value.subtotal &&
    Math.abs(expectedSubtotal - value.subtotal) < 0.011 &&
    Math.abs(expectedTotal - value.total) < 0.011
  );
}

function isPersistedCartV1(value: unknown): value is PersistedCartV1 {
  return (
    isRecord(value) &&
    value.version === CART_STORAGE_VERSION &&
    isCartState(value.cart)
  );
}

export function deserializeCartStorageValue(rawValue: string): CartState | null {
  try {
    const parsed: unknown = JSON.parse(rawValue);
    return isPersistedCartV1(parsed) ? parsed.cart : null;
  } catch {
    return null;
  }
}

export function serializeCartState(state: CartState) {
  const persistedCart: PersistedCartV1 = {
    version: CART_STORAGE_VERSION,
    cart: state,
  };

  return JSON.stringify(persistedCart);
}

export function writeCartToStorage(storage: Storage, state: CartState) {
  if (!isCartState(state)) {
    return false;
  }

  try {
    storage.setItem(CART_STORAGE_KEY, serializeCartState(state));
    return true;
  } catch {
    return false;
  }
}

type LegacyPrintOrderFile = {
  originalFileName: string;
  fileType: PrintFileKind;
  fileSize: number;
  detectedPageCount: number;
};

type LegacyPrintOrder = {
  id: string;
  createdAt: string;
  files: LegacyPrintOrderFile[];
  paperSize: PaperSize;
  copies: number;
  printingMode: PrintMode;
  paperType: PaperType;
  binding: BindingType;
  calculatedSubtotal: number;
  bindingTotal: number;
  grandTotal: number;
};

function isLegacyPrintOrderFile(value: unknown): value is LegacyPrintOrderFile {
  return (
    isRecord(value) &&
    isNonEmptyString(value.originalFileName) &&
    isOneOf(value.fileType, printFileKinds) &&
    isNonNegativeInteger(value.fileSize) &&
    isPositiveInteger(value.detectedPageCount)
  );
}

function isLegacyPrintOrder(value: unknown): value is LegacyPrintOrder {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.createdAt) ||
    !Array.isArray(value.files) ||
    value.files.length === 0 ||
    !value.files.every(isLegacyPrintOrderFile) ||
    !isOneOf(value.paperSize, paperSizes) ||
    !isPositiveInteger(value.copies) ||
    !isOneOf(value.printingMode, printModes) ||
    !isOneOf(value.paperType, paperTypes) ||
    !isOneOf(value.binding, bindingTypes) ||
    !isNonNegativeNumber(value.calculatedSubtotal) ||
    !isNonNegativeNumber(value.bindingTotal) ||
    !isNonNegativeNumber(value.grandTotal)
  ) {
    return false;
  }

  return (
    Math.abs(
      value.calculatedSubtotal + value.bindingTotal - value.grandTotal,
    ) < 0.011
  );
}

function getLegacyMimeType(extension: PrintFileKind) {
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
  }
}

function createLegacyPrintingCartItem(
  order: LegacyPrintOrder,
  itemId: string,
): PrintingCartItem {
  return {
    kind: "printing",
    id: itemId,
    addedAt: order.createdAt,
    files: order.files.map((file, index) => ({
      id: `${itemId}-file-${index + 1}`,
      originalName: file.originalFileName,
      extension: file.fileType,
      mimeType: getLegacyMimeType(file.fileType),
      sizeBytes: file.fileSize,
      pageCount: file.detectedPageCount,
      pageCountSource: "legacy",
    })),
    options: {
      paperSize: order.paperSize,
      copies: order.copies,
      printMode: order.printingMode,
      paperType: order.paperType,
      binding: order.binding,
    },
    priceQuote: {
      version: 1,
      currency: "LE",
      printingSubtotal: order.calculatedSubtotal,
      bindingTotal: order.bindingTotal,
      total: order.grandTotal,
    },
  };
}

function deserializeLegacyPrintOrders(rawValue: string): LegacyPrintOrder[] | null {
  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter(isLegacyPrintOrder);
  } catch {
    return null;
  }
}

function removeStorageItem(storage: Storage, key: string) {
  try {
    storage.removeItem(key);
  } catch {
    // Storage can be unavailable even when reading succeeded. Recovery remains in memory.
  }
}

export function loadCartFromStorage(storage: Storage): CartStorageLoadResult {
  let currentRawValue: string | null;

  try {
    currentRawValue = storage.getItem(CART_STORAGE_KEY);
  } catch {
    return {
      state: createEmptyCartState(),
      source: "unavailable",
      migratedLegacyItemCount: 0,
    };
  }

  if (currentRawValue !== null) {
    const currentState = deserializeCartStorageValue(currentRawValue);

    if (currentState) {
      return {
        state: currentState,
        source: "current",
        migratedLegacyItemCount: 0,
      };
    }

    removeStorageItem(storage, CART_STORAGE_KEY);
  }

  let legacyRawValue: string | null = null;

  try {
    legacyRawValue = storage.getItem(LEGACY_PRINT_ORDER_STORAGE_KEY);
  } catch {
    // Continue with an empty in-memory cart if legacy storage cannot be read.
  }

  if (legacyRawValue !== null) {
    const legacyOrders = deserializeLegacyPrintOrders(legacyRawValue);

    if (legacyOrders) {
      const usedIds = new Set<string>();
      const migratedItems = legacyOrders.map((order, index) => {
        const itemId = usedIds.has(order.id)
          ? `${order.id}-legacy-${index + 1}`
          : order.id;

        usedIds.add(itemId);
        return createLegacyPrintingCartItem(order, itemId);
      });
      const migratedState: CartState = {
        items: migratedItems,
        couponCode: null,
      };

      if (writeCartToStorage(storage, migratedState)) {
        removeStorageItem(storage, LEGACY_PRINT_ORDER_STORAGE_KEY);
      }

      return {
        state: migratedState,
        source: migratedItems.length > 0 ? "legacy" : "empty",
        migratedLegacyItemCount: migratedItems.length,
      };
    }

    removeStorageItem(storage, LEGACY_PRINT_ORDER_STORAGE_KEY);
  }

  const emptyState = createEmptyCartState();
  writeCartToStorage(storage, emptyState);

  return {
    state: emptyState,
    source: currentRawValue !== null || legacyRawValue !== null ? "recovered" : "empty",
    migratedLegacyItemCount: 0,
  };
}
