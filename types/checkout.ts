import type { CartItem, CartTotals } from "@/types/cart";

export type PaymentMethodId =
  | "cash_on_delivery"
  | "vodafone_cash"
  | "instapay"
  | "bank_card";

/** Steps that are approved for the current checkout interface. */
export type CheckoutStep =
  | "delivery"
  | "payment_selection"
  | "payment_details"
  | "order_review"
  | "processing"
  | "success"
  | "failure";

export type DeliveryInformation = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  saveForLater: boolean;
};

export type RequiredDeliveryField = Exclude<
  keyof DeliveryInformation,
  "notes" | "saveForLater"
>;

export type DeliveryInformationErrors = Partial<
  Record<RequiredDeliveryField, string>
>;

export type DeliveryValidationResult =
  | {
      valid: true;
      errors: DeliveryInformationErrors;
    }
  | {
      valid: false;
      errors: DeliveryInformationErrors;
    };

export type TransferReceiptMetadata = {
  fileName: string;
  mimeType: "image/png";
  sizeBytes: number;
};

export type TransferProofDetails = {
  senderName: string;
  senderPhoneLastFour: string;
  receipt: TransferReceiptMetadata | null;
};

export type TransferProofTextField = Exclude<
  keyof TransferProofDetails,
  "receipt"
>;

export type TransferProofDetailsErrors = Partial<
  Record<keyof TransferProofDetails, string>
>;

export type TransferProofValidationResult =
  | {
      valid: true;
      errors: TransferProofDetailsErrors;
    }
  | {
      valid: false;
      errors: TransferProofDetailsErrors;
    };

/** Backward-compatible Vodafone names for the shared transfer-proof model. */
export type VodafoneReceiptMetadata = TransferReceiptMetadata;
export type VodafoneCashDetails = TransferProofDetails;
export type VodafoneCashTextField = TransferProofTextField;
export type VodafoneCashDetailsErrors = TransferProofDetailsErrors;
export type VodafoneCashValidationResult = TransferProofValidationResult;

/** Instapay uses the same serializable proof fields with its own flow state. */
export type InstapayReceiptMetadata = TransferReceiptMetadata;
export type InstapayDetails = TransferProofDetails;
export type InstapayTextField = TransferProofTextField;
export type InstapayDetailsErrors = TransferProofDetailsErrors;
export type InstapayValidationResult = TransferProofValidationResult;

export type BankCardBrand = "meeza" | "visa" | "mastercard";

/** Sensitive values that may exist only in transient React state. */
export type BankCardDetails = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export type BankCardField = keyof BankCardDetails;

export type BankCardDetailsErrors = Partial<
  Record<BankCardField, string>
>;

export type BankCardValidationResult =
  | {
      valid: true;
      brand: BankCardBrand;
      errors: BankCardDetailsErrors;
    }
  | {
      valid: false;
      brand: BankCardBrand | null;
      errors: BankCardDetailsErrors;
    };

/**
 * The only card data that may be copied into a serializable prototype order.
 * PAN, expiry, CVV, and the raw form state must never be persisted.
 */
export type SafeCardMetadata = {
  method: "bank_card";
  brand?: BankCardBrand;
  last4: string;
};

/**
 * Serializable per-tab checkout draft. It preserves only safe form values and
 * receipt metadata; the browser-selected File is never retained or stored.
 */
export type InstapayCheckoutDraft = {
  paymentMethod: "instapay";
  resumeStep: "payment_selection" | "payment_details" | "order_review";
  delivery: DeliveryInformation;
  details: InstapayDetails;
};

/**
 * A per-tab navigation hint only. It deliberately contains no card fields,
 * including when the visual save-information checkbox is checked.
 */
export type BankCardCheckoutDraft = {
  paymentMethod: "bank_card";
  resumeStep: "payment_selection" | "payment_details";
  delivery: DeliveryInformation;
};

/**
 * Safe per-tab context used only after a prototype processing failure. It
 * keeps enough information to retry or choose another method without ever
 * storing card number, expiry, CVV, raw files, or object URLs.
 */
export type CheckoutRetryContext =
  | {
      paymentMethod: "cash_on_delivery";
      resumeStep: "payment_selection";
      delivery: DeliveryInformation;
    }
  | {
      paymentMethod: "vodafone_cash";
      resumeStep: "order_review";
      delivery: DeliveryInformation;
      details: VodafoneCashDetails;
    }
  | {
      paymentMethod: "instapay";
      resumeStep: "order_review";
      delivery: DeliveryInformation;
      details: InstapayDetails;
    }
  | {
      paymentMethod: "bank_card";
      resumeStep: "payment_details";
      delivery: DeliveryInformation;
    };

export type VodafonePrototypePaymentDetails = {
  kind: "vodafone_cash";
  senderName: string;
  senderPhoneLastFour: string;
  receipt: TransferReceiptMetadata;
};

export type InstapayPrototypePaymentDetails = {
  kind: "instapay";
  senderName: string;
  senderPhoneLastFour: string;
  receipt: TransferReceiptMetadata;
};

export type PrototypePaymentDetails =
  | VodafonePrototypePaymentDetails
  | InstapayPrototypePaymentDetails
  | SafeCardMetadata;

export type PrototypeOrderCartSnapshot = {
  items: CartItem[];
  totals: CartTotals;
};

/**
 * Serializable frontend-only order record. It is not proof that a server
 * order or payment transaction was created.
 */
export type PrototypeOrder = {
  orderId: string;
  createdAt: string;
  source: "frontend_prototype";
  paymentMethod: PaymentMethodId;
  paymentDetails?: PrototypePaymentDetails;
  delivery: DeliveryInformation;
  cart: PrototypeOrderCartSnapshot;
};
