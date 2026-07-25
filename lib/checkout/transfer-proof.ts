import type {
  TransferProofDetails,
  TransferProofDetailsErrors,
  TransferProofValidationResult,
  TransferReceiptMetadata,
} from "@/types/checkout";

export const TRANSFER_RECEIPT_MAX_SIZE_BYTES = 1_000_000;

export const TRANSFER_RECEIPT_CONFIG = {
  acceptedExtension: ".png",
  acceptedMimeType: "image/png",
  maxSizeBytes: TRANSFER_RECEIPT_MAX_SIZE_BYTES,
} as const;

export const EMPTY_TRANSFER_PROOF_DETAILS: TransferProofDetails = {
  senderName: "",
  senderPhoneLastFour: "",
  receipt: null,
};

export const TRANSFER_PROOF_VALIDATION_MESSAGES = {
  senderNameRequired: "يرجى إدخال اسم المحول.",
  senderPhoneLastFourRequired: "يرجى إدخال آخر 4 أرقام من رقم الهاتف.",
  senderPhoneLastFourInvalid: "يرجى إدخال 4 أرقام صحيحة من رقم الهاتف.",
  receiptRequired: "يرجى إرفاق صورة التحويل.",
  receiptTypeInvalid: "يجب أن تكون صورة التحويل بصيغة PNG.",
  receiptEmpty: "صورة التحويل فارغة. يرجى اختيار ملف آخر.",
  receiptTooLarge: "يجب أن يكون حجم صورة التحويل أقل من 1 ميجابايت.",
} as const;

export type TransferReceiptInspectionResult =
  | {
      valid: true;
      metadata: TransferReceiptMetadata;
    }
  | {
      valid: false;
      error: string;
    };

function getTransferReceiptError(
  receipt: TransferReceiptMetadata,
): string | undefined {
  if (
    receipt.mimeType !== TRANSFER_RECEIPT_CONFIG.acceptedMimeType ||
    !receipt.fileName.toLowerCase().endsWith(
      TRANSFER_RECEIPT_CONFIG.acceptedExtension,
    )
  ) {
    return TRANSFER_PROOF_VALIDATION_MESSAGES.receiptTypeInvalid;
  }

  if (receipt.sizeBytes <= 0) {
    return TRANSFER_PROOF_VALIDATION_MESSAGES.receiptEmpty;
  }

  if (receipt.sizeBytes >= TRANSFER_RECEIPT_CONFIG.maxSizeBytes) {
    return TRANSFER_PROOF_VALIDATION_MESSAGES.receiptTooLarge;
  }

  return undefined;
}

export function validateTransferProofDetails(
  details: TransferProofDetails,
): TransferProofValidationResult {
  const errors: TransferProofDetailsErrors = {};
  const senderName = details.senderName.trim();
  const senderPhoneLastFour = details.senderPhoneLastFour.trim();

  if (!senderName) {
    errors.senderName = TRANSFER_PROOF_VALIDATION_MESSAGES.senderNameRequired;
  }

  if (!senderPhoneLastFour) {
    errors.senderPhoneLastFour =
      TRANSFER_PROOF_VALIDATION_MESSAGES.senderPhoneLastFourRequired;
  } else if (!/^\d{4}$/.test(senderPhoneLastFour)) {
    errors.senderPhoneLastFour =
      TRANSFER_PROOF_VALIDATION_MESSAGES.senderPhoneLastFourInvalid;
  }

  if (!details.receipt) {
    errors.receipt = TRANSFER_PROOF_VALIDATION_MESSAGES.receiptRequired;
  } else {
    errors.receipt = getTransferReceiptError(details.receipt);
  }

  if (Object.values(errors).some(Boolean)) {
    return { valid: false, errors };
  }

  return { valid: true, errors: {} };
}

/**
 * Inspects a browser-selected file and returns serializable metadata only.
 * The raw File is never placed in checkout state or persisted storage.
 */
export function inspectTransferReceiptFile(
  file: File,
): TransferReceiptInspectionResult {
  if (
    file.type !== TRANSFER_RECEIPT_CONFIG.acceptedMimeType ||
    !file.name.toLowerCase().endsWith(
      TRANSFER_RECEIPT_CONFIG.acceptedExtension,
    )
  ) {
    return {
      valid: false,
      error: TRANSFER_PROOF_VALIDATION_MESSAGES.receiptTypeInvalid,
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: TRANSFER_PROOF_VALIDATION_MESSAGES.receiptEmpty,
    };
  }

  if (file.size >= TRANSFER_RECEIPT_CONFIG.maxSizeBytes) {
    return {
      valid: false,
      error: TRANSFER_PROOF_VALIDATION_MESSAGES.receiptTooLarge,
    };
  }

  const metadata: TransferReceiptMetadata = {
    fileName: file.name,
    mimeType: TRANSFER_RECEIPT_CONFIG.acceptedMimeType,
    sizeBytes: file.size,
  };

  return { valid: true, metadata };
}
