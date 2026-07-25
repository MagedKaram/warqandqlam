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
  VodafoneCashDetails,
  VodafoneCashValidationResult,
} from "@/types/checkout";

export const VODAFONE_RECEIPT_MAX_SIZE_BYTES =
  TRANSFER_RECEIPT_MAX_SIZE_BYTES;

export const VODAFONE_CASH_CONFIG = {
  walletNumber: "010535634366",
  accountName: "ورقة وقلم للمستلزمات المكتبية",
  instructions: [
    "حول المبلغ إلي الرقم اعلاه",
    "احفظ صورة التحويل",
    "ارفع صورة التحويل لاتمام الطلب",
  ],
  receipt: TRANSFER_RECEIPT_CONFIG,
} as const;

export const EMPTY_VODAFONE_CASH_DETAILS: VodafoneCashDetails = {
  ...EMPTY_TRANSFER_PROOF_DETAILS,
};

export const VODAFONE_CASH_VALIDATION_MESSAGES =
  TRANSFER_PROOF_VALIDATION_MESSAGES;

export type VodafoneReceiptInspectionResult =
  TransferReceiptInspectionResult;

export function validateVodafoneCashDetails(
  details: VodafoneCashDetails,
): VodafoneCashValidationResult {
  return validateTransferProofDetails(details);
}

/**
 * Vodafone-compatible facade over the shared metadata-only file inspection.
 */
export function inspectVodafoneReceiptFile(
  file: File,
): VodafoneReceiptInspectionResult {
  return inspectTransferReceiptFile(file);
}
