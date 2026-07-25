import type { CartItem, CartTotals } from "@/types/cart";
import { TRANSFER_RECEIPT_CONFIG } from "@/lib/checkout/transfer-proof";
import type {
  DeliveryInformation,
  PaymentMethodId,
  PrototypeOrder,
} from "@/types/checkout";

export const CHECKOUT_STORAGE_VERSION = 1 as const;

export const SAVED_DELIVERY_STORAGE_KEY =
  "warqandqlam.checkout.saved-delivery.v1";

export const LATEST_ORDER_STORAGE_KEY =
  "warqandqlam.checkout.latest-order.v1";

type CheckoutStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

type VersionedStorageEnvelope<T> = {
  version: typeof CHECKOUT_STORAGE_VERSION;
  data: T;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 1;
}

function isIsoTimestamp(value: unknown): value is string {
  return isNonEmptyString(value) && Number.isFinite(Date.parse(value));
}

function isPaymentMethodId(value: unknown): value is PaymentMethodId {
  return (
    value === "cash_on_delivery" ||
    value === "vodafone_cash" ||
    value === "instapay" ||
    value === "bank_card"
  );
}

export function isDeliveryInformation(
  value: unknown,
): value is DeliveryInformation {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.fullName) &&
    isString(value.phone) &&
    isString(value.email) &&
    isString(value.address) &&
    isString(value.city) &&
    isString(value.notes) &&
    typeof value.saveForLater === "boolean"
  );
}

function isProductCartColor(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.label) &&
    isNonEmptyString(value.value)
  );
}

function isProductCartItem(value: unknown): value is CartItem {
  if (!isRecord(value) || value.kind !== "product") {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.productId) &&
    isNonEmptyString(value.title) &&
    (value.brandName === undefined || isNonEmptyString(value.brandName)) &&
    isNonEmptyString(value.image) &&
    isString(value.imageAlt) &&
    isNonEmptyString(value.href) &&
    isFiniteNonNegativeNumber(value.unitPrice) &&
    value.currency === "LE" &&
    isPositiveInteger(value.quantity) &&
    (value.selectedColor === undefined ||
      isProductCartColor(value.selectedColor)) &&
    isIsoTimestamp(value.addedAt)
  );
}

const printFileExtensions = new Set([
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
]);

const pageCountSources = new Set([
  "detected",
  "image",
  "fallback",
  "legacy",
]);

function isPrintingCartFile(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.originalName) &&
    isString(value.extension) &&
    printFileExtensions.has(value.extension) &&
    isString(value.mimeType) &&
    isFiniteNonNegativeNumber(value.sizeBytes) &&
    isPositiveInteger(value.pageCount) &&
    isString(value.pageCountSource) &&
    pageCountSources.has(value.pageCountSource)
  );
}

function isPrintingOptions(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.paperSize === "a4" ||
      value.paperSize === "a3" ||
      value.paperSize === "a5") &&
    isPositiveInteger(value.copies) &&
    (value.printMode === "color" || value.printMode === "blackWhite") &&
    (value.paperType === "plain80" ||
      value.paperType === "plain100" ||
      value.paperType === "coated" ||
      value.paperType === "cardstock") &&
    (value.binding === "none" ||
      value.binding === "staple" ||
      value.binding === "wire" ||
      value.binding === "thermal")
  );
}

function isPrintingPriceQuote(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 1 &&
    value.currency === "LE" &&
    isFiniteNonNegativeNumber(value.printingSubtotal) &&
    isFiniteNonNegativeNumber(value.bindingTotal) &&
    isFiniteNonNegativeNumber(value.total)
  );
}

function isPrintingCartItem(value: unknown): value is CartItem {
  if (!isRecord(value) || value.kind !== "printing") {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    Array.isArray(value.files) &&
    value.files.length > 0 &&
    value.files.every(isPrintingCartFile) &&
    isPrintingOptions(value.options) &&
    isPrintingPriceQuote(value.priceQuote) &&
    isIsoTimestamp(value.addedAt)
  );
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) {
    return false;
  }

  if (value.kind === "product") {
    return isProductCartItem(value);
  }

  if (value.kind === "printing") {
    return isPrintingCartItem(value);
  }

  return false;
}

function isCartTotals(value: unknown): value is CartTotals {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isFiniteNonNegativeNumber(value.productSubtotal) &&
    isFiniteNonNegativeNumber(value.printingSubtotal) &&
    isFiniteNonNegativeNumber(value.subtotal) &&
    isFiniteNonNegativeNumber(value.discount) &&
    isFiniteNonNegativeNumber(value.shipping) &&
    isFiniteNonNegativeNumber(value.total) &&
    isFiniteNonNegativeNumber(value.amountUntilFreeShipping) &&
    typeof value.hasFreeShipping === "boolean" &&
    (value.appliedCouponCode === null ||
      isNonEmptyString(value.appliedCouponCode))
  );
}

function isTransferPaymentDetails(
  value: unknown,
  kind: "vodafone_cash" | "instapay",
) {
  if (!isRecord(value) || !isRecord(value.receipt)) {
    return false;
  }

  return (
    value.kind === kind &&
    isNonEmptyString(value.senderName) &&
    typeof value.senderPhoneLastFour === "string" &&
    /^\d{4}$/.test(value.senderPhoneLastFour) &&
    isNonEmptyString(value.receipt.fileName) &&
    value.receipt.fileName.toLowerCase().endsWith(
      TRANSFER_RECEIPT_CONFIG.acceptedExtension,
    ) &&
    value.receipt.mimeType === TRANSFER_RECEIPT_CONFIG.acceptedMimeType &&
    typeof value.receipt.sizeBytes === "number" &&
    Number.isFinite(value.receipt.sizeBytes) &&
    value.receipt.sizeBytes > 0 &&
    value.receipt.sizeBytes < TRANSFER_RECEIPT_CONFIG.maxSizeBytes
  );
}

const bankCardBrands = new Set(["meeza", "visa", "mastercard"]);

function isSafeCardMetadata(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  const allowedKeys = new Set(["method", "brand", "last4"]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) {
    return false;
  }

  return (
    value.method === "bank_card" &&
    (value.brand === undefined ||
      (typeof value.brand === "string" && bankCardBrands.has(value.brand))) &&
    typeof value.last4 === "string" &&
    /^\d{4}$/.test(value.last4)
  );
}

function hasValidPaymentDetails(value: Record<string, unknown>) {
  if (value.paymentMethod === "vodafone_cash") {
    return isTransferPaymentDetails(value.paymentDetails, "vodafone_cash");
  }

  if (value.paymentMethod === "instapay") {
    return isTransferPaymentDetails(value.paymentDetails, "instapay");
  }

  if (value.paymentMethod === "bank_card") {
    return isSafeCardMetadata(value.paymentDetails);
  }

  return value.paymentDetails === undefined;
}

export function isPrototypeOrder(value: unknown): value is PrototypeOrder {
  if (!isRecord(value) || !isRecord(value.cart)) {
    return false;
  }

  return (
    isNonEmptyString(value.orderId) &&
    isIsoTimestamp(value.createdAt) &&
    value.source === "frontend_prototype" &&
    isPaymentMethodId(value.paymentMethod) &&
    hasValidPaymentDetails(value) &&
    isDeliveryInformation(value.delivery) &&
    Array.isArray(value.cart.items) &&
    value.cart.items.length > 0 &&
    value.cart.items.every(isCartItem) &&
    isCartTotals(value.cart.totals)
  );
}

function getBrowserStorage(): CheckoutStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function removeValue(storage: CheckoutStorage, key: string) {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function readVersionedValue<T>(
  key: string,
  validate: (value: unknown) => value is T,
): T | null {
  const storage = getBrowserStorage();
  if (!storage) {
    return null;
  }

  let rawValue: string | null;
  try {
    rawValue = storage.getItem(key);
  } catch {
    return null;
  }

  if (rawValue === null) {
    return null;
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(rawValue) as unknown;
  } catch {
    removeValue(storage, key);
    return null;
  }

  if (
    !isRecord(parsedValue) ||
    parsedValue.version !== CHECKOUT_STORAGE_VERSION ||
    !validate(parsedValue.data)
  ) {
    removeValue(storage, key);
    return null;
  }

  return parsedValue.data;
}

function writeVersionedValue<T>(
  key: string,
  data: T,
  validate: (value: unknown) => value is T,
) {
  if (!validate(data)) {
    return false;
  }

  const storage = getBrowserStorage();
  if (!storage) {
    return false;
  }

  const envelope: VersionedStorageEnvelope<T> = {
    version: CHECKOUT_STORAGE_VERSION,
    data,
  };

  try {
    storage.setItem(key, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}

export function loadSavedDeliveryInformation() {
  return readVersionedValue(
    SAVED_DELIVERY_STORAGE_KEY,
    isDeliveryInformation,
  );
}

export function saveDeliveryInformation(delivery: DeliveryInformation) {
  return writeVersionedValue(
    SAVED_DELIVERY_STORAGE_KEY,
    delivery,
    isDeliveryInformation,
  );
}

export function clearSavedDeliveryInformation() {
  const storage = getBrowserStorage();
  return storage
    ? removeValue(storage, SAVED_DELIVERY_STORAGE_KEY)
    : false;
}

export function syncSavedDeliveryPreference(delivery: DeliveryInformation) {
  return delivery.saveForLater
    ? saveDeliveryInformation(delivery)
    : clearSavedDeliveryInformation();
}

export function loadLatestPrototypeOrder() {
  return readVersionedValue(LATEST_ORDER_STORAGE_KEY, isPrototypeOrder);
}

export function saveLatestPrototypeOrder(order: PrototypeOrder) {
  return writeVersionedValue(
    LATEST_ORDER_STORAGE_KEY,
    order,
    isPrototypeOrder,
  );
}

export function clearLatestPrototypeOrder() {
  const storage = getBrowserStorage();
  return storage ? removeValue(storage, LATEST_ORDER_STORAGE_KEY) : false;
}
