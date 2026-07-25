import { isDeliveryInformation } from "@/lib/checkout/checkout-storage";
import { TRANSFER_RECEIPT_CONFIG } from "@/lib/checkout/transfer-proof";
import type {
  BankCardCheckoutDraft,
  CheckoutRetryContext,
  DeliveryInformation,
  InstapayCheckoutDraft,
  TransferProofDetails,
} from "@/types/checkout";

export const CHECKOUT_DRAFT_STORAGE_VERSION = 1 as const;
export const INSTAPAY_CHECKOUT_DRAFT_STORAGE_KEY =
  "warqandqlam.checkout.instapay-draft.v1";
export const BANK_CARD_CHECKOUT_DRAFT_STORAGE_KEY =
  "warqandqlam.checkout.bank-card-draft.v1";
export const CHECKOUT_RETRY_CONTEXT_STORAGE_KEY =
  "warqandqlam.checkout.retry-context.v1";

type CheckoutDraftStorage = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

type VersionedInstapayDraft = {
  version: typeof CHECKOUT_DRAFT_STORAGE_VERSION;
  data: InstapayCheckoutDraft;
};

type VersionedBankCardDraft = {
  version: typeof CHECKOUT_DRAFT_STORAGE_VERSION;
  data: BankCardCheckoutDraft;
};

type VersionedCheckoutRetryContext = {
  version: typeof CHECKOUT_DRAFT_STORAGE_VERSION;
  data: CheckoutRetryContext;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneDeliveryInformation(
  delivery: DeliveryInformation,
): DeliveryInformation {
  return {
    fullName: delivery.fullName,
    phone: delivery.phone,
    email: delivery.email,
    address: delivery.address,
    city: delivery.city,
    notes: delivery.notes,
    saveForLater: delivery.saveForLater,
  };
}

function cloneTransferProofDetails(
  details: TransferProofDetails,
): TransferProofDetails {
  return {
    senderName: details.senderName,
    senderPhoneLastFour: details.senderPhoneLastFour,
    receipt: details.receipt
      ? {
          fileName: details.receipt.fileName,
          mimeType: details.receipt.mimeType,
          sizeBytes: details.receipt.sizeBytes,
        }
      : null,
  };
}

function cloneCheckoutRetryContext(
  context: CheckoutRetryContext,
): CheckoutRetryContext {
  if (context.paymentMethod === "vodafone_cash") {
    return {
      paymentMethod: "vodafone_cash",
      resumeStep: "order_review",
      delivery: cloneDeliveryInformation(context.delivery),
      details: cloneTransferProofDetails(context.details),
    };
  }

  if (context.paymentMethod === "instapay") {
    return {
      paymentMethod: "instapay",
      resumeStep: "order_review",
      delivery: cloneDeliveryInformation(context.delivery),
      details: cloneTransferProofDetails(context.details),
    };
  }

  if (context.paymentMethod === "bank_card") {
    return {
      paymentMethod: "bank_card",
      resumeStep: "payment_details",
      delivery: cloneDeliveryInformation(context.delivery),
    };
  }

  return {
    paymentMethod: "cash_on_delivery",
    resumeStep: "payment_selection",
    delivery: cloneDeliveryInformation(context.delivery),
  };
}

function isTransferReceiptMetadata(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.fileName === "string" &&
    value.fileName.trim().length > 0 &&
    value.fileName.toLowerCase().endsWith(
      TRANSFER_RECEIPT_CONFIG.acceptedExtension,
    ) &&
    value.mimeType === TRANSFER_RECEIPT_CONFIG.acceptedMimeType &&
    typeof value.sizeBytes === "number" &&
    Number.isFinite(value.sizeBytes) &&
    value.sizeBytes > 0 &&
    value.sizeBytes < TRANSFER_RECEIPT_CONFIG.maxSizeBytes
  );
}

export function isInstapayCheckoutDraft(
  value: unknown,
): value is InstapayCheckoutDraft {
  if (
    !isRecord(value) ||
    value.paymentMethod !== "instapay" ||
    (value.resumeStep !== "payment_selection" &&
      value.resumeStep !== "payment_details" &&
      value.resumeStep !== "order_review") ||
    !isDeliveryInformation(value.delivery) ||
    !isRecord(value.details)
  ) {
    return false;
  }

  return (
    typeof value.details.senderName === "string" &&
    typeof value.details.senderPhoneLastFour === "string" &&
    (value.details.receipt === null ||
      isTransferReceiptMetadata(value.details.receipt))
  );
}

function isTransferProofDetails(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.senderName === "string" &&
    typeof value.senderPhoneLastFour === "string" &&
    (value.receipt === null || isTransferReceiptMetadata(value.receipt))
  );
}

export function isCheckoutRetryContext(
  value: unknown,
): value is CheckoutRetryContext {
  if (!isRecord(value) || !isDeliveryInformation(value.delivery)) {
    return false;
  }

  if (value.paymentMethod === "cash_on_delivery") {
    return value.resumeStep === "payment_selection";
  }

  if (value.paymentMethod === "bank_card") {
    return value.resumeStep === "payment_details";
  }

  if (
    value.paymentMethod === "vodafone_cash" ||
    value.paymentMethod === "instapay"
  ) {
    return (
      value.resumeStep === "order_review" &&
      isTransferProofDetails(value.details)
    );
  }

  return false;
}

export function isBankCardCheckoutDraft(
  value: unknown,
): value is BankCardCheckoutDraft {
  return (
    isRecord(value) &&
    value.paymentMethod === "bank_card" &&
    (value.resumeStep === "payment_selection" ||
      value.resumeStep === "payment_details") &&
    isDeliveryInformation(value.delivery)
  );
}

function getSessionStorage(): CheckoutDraftStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function loadInstapayCheckoutDraft(): InstapayCheckoutDraft | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  let rawValue: string | null;
  try {
    rawValue = storage.getItem(INSTAPAY_CHECKOUT_DRAFT_STORAGE_KEY);
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
    clearInstapayCheckoutDraft();
    return null;
  }

  if (
    !isRecord(parsedValue) ||
    parsedValue.version !== CHECKOUT_DRAFT_STORAGE_VERSION ||
    !isInstapayCheckoutDraft(parsedValue.data)
  ) {
    clearInstapayCheckoutDraft();
    return null;
  }

  return parsedValue.data;
}

export function saveInstapayCheckoutDraft(
  draft: InstapayCheckoutDraft,
) {
  if (!isInstapayCheckoutDraft(draft)) {
    return false;
  }

  const storage = getSessionStorage();
  if (!storage) {
    return false;
  }

  const envelope: VersionedInstapayDraft = {
    version: CHECKOUT_DRAFT_STORAGE_VERSION,
    data: {
      paymentMethod: "instapay",
      resumeStep: draft.resumeStep,
      delivery: cloneDeliveryInformation(draft.delivery),
      details: cloneTransferProofDetails(draft.details),
    },
  };

  try {
    storage.setItem(
      INSTAPAY_CHECKOUT_DRAFT_STORAGE_KEY,
      JSON.stringify(envelope),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearInstapayCheckoutDraft() {
  const storage = getSessionStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(INSTAPAY_CHECKOUT_DRAFT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadBankCardCheckoutDraft(): BankCardCheckoutDraft | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  let rawValue: string | null;
  try {
    rawValue = storage.getItem(BANK_CARD_CHECKOUT_DRAFT_STORAGE_KEY);
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
    clearBankCardCheckoutDraft();
    return null;
  }

  if (
    !isRecord(parsedValue) ||
    parsedValue.version !== CHECKOUT_DRAFT_STORAGE_VERSION ||
    !isBankCardCheckoutDraft(parsedValue.data)
  ) {
    clearBankCardCheckoutDraft();
    return null;
  }

  return parsedValue.data;
}

export function saveBankCardCheckoutDraft(
  draft: BankCardCheckoutDraft,
) {
  if (!isBankCardCheckoutDraft(draft)) {
    return false;
  }

  const storage = getSessionStorage();
  if (!storage) {
    return false;
  }

  const envelope: VersionedBankCardDraft = {
    version: CHECKOUT_DRAFT_STORAGE_VERSION,
    data: {
      paymentMethod: "bank_card",
      resumeStep: draft.resumeStep,
      delivery: cloneDeliveryInformation(draft.delivery),
    },
  };

  try {
    storage.setItem(
      BANK_CARD_CHECKOUT_DRAFT_STORAGE_KEY,
      JSON.stringify(envelope),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearBankCardCheckoutDraft() {
  const storage = getSessionStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(BANK_CARD_CHECKOUT_DRAFT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadCheckoutRetryContext(): CheckoutRetryContext | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  let rawValue: string | null;
  try {
    rawValue = storage.getItem(CHECKOUT_RETRY_CONTEXT_STORAGE_KEY);
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
    clearCheckoutRetryContext();
    return null;
  }

  if (
    !isRecord(parsedValue) ||
    parsedValue.version !== CHECKOUT_DRAFT_STORAGE_VERSION ||
    !isCheckoutRetryContext(parsedValue.data)
  ) {
    clearCheckoutRetryContext();
    return null;
  }

  return parsedValue.data;
}

export function saveCheckoutRetryContext(context: CheckoutRetryContext) {
  if (!isCheckoutRetryContext(context)) {
    return false;
  }

  const storage = getSessionStorage();
  if (!storage) {
    return false;
  }

  const envelope: VersionedCheckoutRetryContext = {
    version: CHECKOUT_DRAFT_STORAGE_VERSION,
    data: cloneCheckoutRetryContext(context),
  };

  try {
    storage.setItem(
      CHECKOUT_RETRY_CONTEXT_STORAGE_KEY,
      JSON.stringify(envelope),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearCheckoutRetryContext() {
  const storage = getSessionStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(CHECKOUT_RETRY_CONTEXT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
