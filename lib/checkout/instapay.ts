import {
  EMPTY_TRANSFER_PROOF_DETAILS,
  inspectTransferReceiptFile,
  TRANSFER_PROOF_VALIDATION_MESSAGES,
  TRANSFER_RECEIPT_CONFIG,
  TRANSFER_RECEIPT_MAX_SIZE_BYTES,
  type TransferReceiptInspectionResult,
  validateTransferProofDetails,
} from "@/lib/checkout/transfer-proof";
import type {
  InstapayDetails,
  InstapayValidationResult,
} from "@/types/checkout";

export const INSTAPAY_RECEIPT_MAX_SIZE_BYTES =
  TRANSFER_RECEIPT_MAX_SIZE_BYTES;

export const INSTAPAY_CONFIG = {
  displayLabel: "Instapay",
  username: "username@instapay",
  phoneNumber: "010477359653",
  qrPrompt: "او امسح QR Code للتحويل",
  logoPath: "/assets/images/payment/instapay.png",
  qrCodePath: "/assets/images/payment/qr-code.png",
  instructions: [
    "حول المبلغ إلي الرقم اعلاه",
    "احفظ صورة التحويل",
    "ارفع صورة التحويل لاتمام الطلب",
  ],
  detailsActionLabel: "المتابعة للدفع",
  prototypeProcessingDelayMs: 900,
  receipt: TRANSFER_RECEIPT_CONFIG,
} as const;

export const EMPTY_INSTAPAY_DETAILS: InstapayDetails = {
  ...EMPTY_TRANSFER_PROOF_DETAILS,
};

export const INSTAPAY_VALIDATION_MESSAGES =
  TRANSFER_PROOF_VALIDATION_MESSAGES;

export type InstapayReceiptInspectionResult =
  TransferReceiptInspectionResult;

export function validateInstapayDetails(
  details: InstapayDetails,
): InstapayValidationResult {
  return validateTransferProofDetails(details);
}

/**
 * Inspects the selected proof and returns metadata only; no raw file is kept.
 */
export function inspectInstapayReceiptFile(
  file: File,
): InstapayReceiptInspectionResult {
  return inspectTransferReceiptFile(file);
}
