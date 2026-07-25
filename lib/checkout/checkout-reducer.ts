import {
  DEFAULT_PAYMENT_METHOD_ID,
  getPaymentMethod,
} from "@/lib/checkout/payment-methods";
import {
  createSafeCardMetadata,
  EMPTY_BANK_CARD_DETAILS,
  validateBankCardDetails,
} from "@/lib/checkout/bank-card";
import {
  EMPTY_INSTAPAY_DETAILS,
  validateInstapayDetails,
} from "@/lib/checkout/instapay";
import {
  EMPTY_VODAFONE_CASH_DETAILS,
  validateVodafoneCashDetails,
} from "@/lib/checkout/vodafone-cash";
import type {
  BankCardCheckoutDraft,
  BankCardDetails,
  BankCardDetailsErrors,
  BankCardField,
  CheckoutRetryContext,
  CheckoutStep,
  DeliveryInformation,
  DeliveryInformationErrors,
  DeliveryValidationResult,
  InstapayCheckoutDraft,
  InstapayDetails,
  InstapayDetailsErrors,
  InstapayReceiptMetadata,
  InstapayTextField,
  PaymentMethodId,
  PrototypeOrder,
  SafeCardMetadata,
  VodafoneCashDetails,
  VodafoneCashDetailsErrors,
  VodafoneCashTextField,
  VodafoneReceiptMetadata,
} from "@/types/checkout";

export const EMPTY_DELIVERY_INFORMATION: DeliveryInformation = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  notes: "",
  saveForLater: false,
};

export const DELIVERY_VALIDATION_MESSAGES = {
  fullNameRequired: "يرجى إدخال الاسم الكامل.",
  phoneRequired: "يرجى إدخال رقم الهاتف.",
  phoneInvalid: "يرجى إدخال رقم هاتف صحيح.",
  emailRequired: "يرجى إدخال البريد الإلكتروني.",
  emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
  addressRequired: "يرجى إدخال عنوان التوصيل.",
  cityRequired: "يرجى إدخال المدينة أو المحافظة.",
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhoneDigits(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function validateDeliveryInformation(
  delivery: DeliveryInformation,
): DeliveryValidationResult {
  const errors: DeliveryInformationErrors = {};
  const fullName = delivery.fullName.trim();
  const phone = delivery.phone.trim();
  const email = delivery.email.trim();
  const address = delivery.address.trim();
  const city = delivery.city.trim();

  if (!fullName) {
    errors.fullName = DELIVERY_VALIDATION_MESSAGES.fullNameRequired;
  }

  if (!phone) {
    errors.phone = DELIVERY_VALIDATION_MESSAGES.phoneRequired;
  } else {
    const phoneDigits = normalizePhoneDigits(phone);
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      errors.phone = DELIVERY_VALIDATION_MESSAGES.phoneInvalid;
    }
  }

  if (!email) {
    errors.email = DELIVERY_VALIDATION_MESSAGES.emailRequired;
  } else if (!emailPattern.test(email)) {
    errors.email = DELIVERY_VALIDATION_MESSAGES.emailInvalid;
  }

  if (!address) {
    errors.address = DELIVERY_VALIDATION_MESSAGES.addressRequired;
  }

  if (!city) {
    errors.city = DELIVERY_VALIDATION_MESSAGES.cityRequired;
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors };
}

export type CheckoutState = {
  storageHydrated: boolean;
  step: CheckoutStep;
  delivery: DeliveryInformation;
  deliveryErrors: DeliveryInformationErrors;
  paymentMethod: PaymentMethodId;
  vodafoneCashDetails: VodafoneCashDetails;
  vodafoneCashErrors: VodafoneCashDetailsErrors;
  instapayDetails: InstapayDetails;
  instapayErrors: InstapayDetailsErrors;
  bankCardDetails: BankCardDetails;
  bankCardErrors: BankCardDetailsErrors;
  bankCardSaveForLater: boolean;
  bankCardMetadata: SafeCardMetadata | null;
  completedOrder: PrototypeOrder | null;
  failureMessage: string | null;
};

type DeliveryFieldUpdateAction = {
  [Field in keyof DeliveryInformation]: {
    type: "delivery_field_updated";
    field: Field;
    value: DeliveryInformation[Field];
  };
}[keyof DeliveryInformation];

type VodafoneCashTextUpdateAction = {
  [Field in VodafoneCashTextField]: {
    type: "vodafone_cash_text_updated";
    field: Field;
    value: VodafoneCashDetails[Field];
  };
}[VodafoneCashTextField];

type InstapayTextUpdateAction = {
  [Field in InstapayTextField]: {
    type: "instapay_text_updated";
    field: Field;
    value: InstapayDetails[Field];
  };
}[InstapayTextField];

type BankCardFieldUpdateAction = {
  [Field in BankCardField]: {
    type: "bank_card_field_updated";
    field: Field;
    value: BankCardDetails[Field];
  };
}[BankCardField];

export type CheckoutAction =
  | DeliveryFieldUpdateAction
  | VodafoneCashTextUpdateAction
  | InstapayTextUpdateAction
  | BankCardFieldUpdateAction
  | { type: "saved_delivery_loaded"; delivery: DeliveryInformation }
  | { type: "instapay_draft_loaded"; draft: InstapayCheckoutDraft }
  | { type: "bank_card_draft_loaded"; draft: BankCardCheckoutDraft }
  | { type: "checkout_retry_context_loaded"; context: CheckoutRetryContext }
  | { type: "checkout_storage_hydrated" }
  | { type: "delivery_submitted" }
  | { type: "delivery_edit_requested" }
  | { type: "payment_method_selected"; paymentMethod: PaymentMethodId }
  | { type: "payment_method_change_requested" }
  | { type: "payment_submitted" }
  | {
      type: "vodafone_cash_receipt_updated";
      receipt: VodafoneReceiptMetadata | null;
      error?: string;
    }
  | { type: "vodafone_cash_details_submitted" }
  | {
      type: "instapay_receipt_updated";
      receipt: InstapayReceiptMetadata | null;
      error?: string;
    }
  | { type: "instapay_details_submitted" }
  | { type: "bank_card_save_for_later_updated"; checked: boolean }
  | { type: "bank_card_details_submitted" }
  | { type: "order_review_submitted" }
  | { type: "order_succeeded"; order: PrototypeOrder }
  | { type: "order_failed"; message: string }
  | { type: "retry_requested" }
  | { type: "checkout_reset"; delivery?: DeliveryInformation };

export function createInitialCheckoutState(
  delivery: DeliveryInformation = EMPTY_DELIVERY_INFORMATION,
): CheckoutState {
  return {
    storageHydrated: false,
    step: "delivery",
    delivery: { ...delivery },
    deliveryErrors: {},
    paymentMethod: DEFAULT_PAYMENT_METHOD_ID,
    vodafoneCashDetails: { ...EMPTY_VODAFONE_CASH_DETAILS },
    vodafoneCashErrors: {},
    instapayDetails: { ...EMPTY_INSTAPAY_DETAILS },
    instapayErrors: {},
    bankCardDetails: { ...EMPTY_BANK_CARD_DETAILS },
    bankCardErrors: {},
    bankCardSaveForLater: false,
    bankCardMetadata: null,
    completedOrder: null,
    failureMessage: null,
  };
}

function preserveSafeBankCardDraft(details: BankCardDetails): BankCardDetails {
  return {
    ...EMPTY_BANK_CARD_DETAILS,
    cardholderName: details.cardholderName,
  };
}

export function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction,
): CheckoutState {
  switch (action.type) {
    case "delivery_field_updated":
      return {
        ...state,
        delivery: {
          ...state.delivery,
          [action.field]: action.value,
        },
        deliveryErrors: {
          ...state.deliveryErrors,
          [action.field]: undefined,
        },
        failureMessage: null,
      };

    case "saved_delivery_loaded":
      return {
        ...state,
        delivery: { ...action.delivery },
        deliveryErrors: {},
      };

    case "checkout_storage_hydrated":
      return {
        ...state,
        storageHydrated: true,
      };

    case "instapay_draft_loaded": {
      const deliveryValidation = validateDeliveryInformation(
        action.draft.delivery,
      );

      return {
        ...state,
        step: deliveryValidation.valid ? action.draft.resumeStep : "delivery",
        delivery: { ...action.draft.delivery },
        deliveryErrors: deliveryValidation.valid
          ? {}
          : deliveryValidation.errors,
        paymentMethod: "instapay",
        instapayDetails: {
          ...action.draft.details,
          receipt: action.draft.details.receipt
            ? { ...action.draft.details.receipt }
            : null,
        },
        instapayErrors: {},
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "bank_card_draft_loaded": {
      const deliveryValidation = validateDeliveryInformation(
        action.draft.delivery,
      );

      return {
        ...state,
        step: deliveryValidation.valid
          ? action.draft.resumeStep
          : "delivery",
        delivery: { ...action.draft.delivery },
        deliveryErrors: deliveryValidation.valid
          ? {}
          : deliveryValidation.errors,
        paymentMethod: "bank_card",
        bankCardDetails: { ...EMPTY_BANK_CARD_DETAILS },
        bankCardErrors: {},
        bankCardSaveForLater: false,
        bankCardMetadata: null,
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "checkout_retry_context_loaded": {
      const deliveryValidation = validateDeliveryInformation(
        action.context.delivery,
      );
      let resumeStep: CheckoutStep = action.context.resumeStep;

      if (action.context.paymentMethod === "vodafone_cash") {
        const validation = validateVodafoneCashDetails(action.context.details);
        if (!validation.valid) {
          resumeStep = "payment_details";
        }
      } else if (action.context.paymentMethod === "instapay") {
        const validation = validateInstapayDetails(action.context.details);
        if (!validation.valid) {
          resumeStep = "payment_details";
        }
      }

      return {
        ...state,
        step: deliveryValidation.valid ? resumeStep : "delivery",
        delivery: { ...action.context.delivery },
        deliveryErrors: deliveryValidation.valid
          ? {}
          : deliveryValidation.errors,
        paymentMethod: action.context.paymentMethod,
        vodafoneCashDetails:
          action.context.paymentMethod === "vodafone_cash"
            ? {
                ...action.context.details,
                receipt: action.context.details.receipt
                  ? { ...action.context.details.receipt }
                  : null,
              }
            : state.vodafoneCashDetails,
        vodafoneCashErrors: {},
        instapayDetails:
          action.context.paymentMethod === "instapay"
            ? {
                ...action.context.details,
                receipt: action.context.details.receipt
                  ? { ...action.context.details.receipt }
                  : null,
              }
            : state.instapayDetails,
        instapayErrors: {},
        bankCardDetails: { ...EMPTY_BANK_CARD_DETAILS },
        bankCardErrors: {},
        bankCardSaveForLater: false,
        bankCardMetadata: null,
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "vodafone_cash_text_updated":
      return {
        ...state,
        vodafoneCashDetails: {
          ...state.vodafoneCashDetails,
          [action.field]: action.value,
        },
        vodafoneCashErrors: {
          ...state.vodafoneCashErrors,
          [action.field]: undefined,
        },
        failureMessage: null,
      };

    case "vodafone_cash_receipt_updated":
      return {
        ...state,
        vodafoneCashDetails: {
          ...state.vodafoneCashDetails,
          receipt: action.receipt,
        },
        vodafoneCashErrors: {
          ...state.vodafoneCashErrors,
          receipt: action.error,
        },
        failureMessage: null,
      };

    case "instapay_text_updated":
      return {
        ...state,
        instapayDetails: {
          ...state.instapayDetails,
          [action.field]: action.value,
        },
        instapayErrors: {
          ...state.instapayErrors,
          [action.field]: undefined,
        },
        failureMessage: null,
      };

    case "instapay_receipt_updated":
      return {
        ...state,
        instapayDetails: {
          ...state.instapayDetails,
          receipt: action.receipt,
        },
        instapayErrors: {
          ...state.instapayErrors,
          receipt: action.error,
        },
        failureMessage: null,
      };

    case "bank_card_field_updated":
      return {
        ...state,
        bankCardDetails: {
          ...state.bankCardDetails,
          [action.field]: action.value,
        },
        bankCardErrors: {
          ...state.bankCardErrors,
          [action.field]: undefined,
        },
        bankCardMetadata: null,
        failureMessage: null,
      };

    case "bank_card_save_for_later_updated":
      return {
        ...state,
        bankCardSaveForLater: action.checked,
        failureMessage: null,
      };

    case "delivery_submitted": {
      const validation = validateDeliveryInformation(state.delivery);
      if (!validation.valid) {
        return {
          ...state,
          step: "delivery",
          deliveryErrors: validation.errors,
        };
      }

      return {
        ...state,
        step: "payment_selection",
        deliveryErrors: {},
        failureMessage: null,
      };
    }

    case "delivery_edit_requested":
      if (state.step !== "order_review") {
        return state;
      }

      return {
        ...state,
        step: "delivery",
        failureMessage: null,
      };

    case "payment_method_selected": {
      if (
        state.step !== "delivery" &&
        state.step !== "payment_selection"
      ) {
        return state;
      }

      const switchingAwayFromBankCard =
        state.paymentMethod === "bank_card" &&
        action.paymentMethod !== "bank_card";

      return {
        ...state,
        step: "payment_selection",
        paymentMethod: action.paymentMethod,
        vodafoneCashErrors: {},
        instapayErrors: {},
        bankCardDetails: switchingAwayFromBankCard
          ? preserveSafeBankCardDraft(state.bankCardDetails)
          : state.bankCardDetails,
        bankCardErrors: {},
        bankCardSaveForLater: switchingAwayFromBankCard
          ? false
          : state.bankCardSaveForLater,
        bankCardMetadata: null,
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "payment_method_change_requested":
      if (
        state.step !== "payment_details" &&
        state.step !== "order_review" &&
        state.step !== "failure"
      ) {
        return state;
      }

      return {
        ...state,
        step: "payment_selection",
        vodafoneCashErrors: {},
        instapayErrors: {},
        bankCardDetails:
          state.paymentMethod === "bank_card"
            ? preserveSafeBankCardDraft(state.bankCardDetails)
            : state.bankCardDetails,
        bankCardErrors: {},
        bankCardSaveForLater:
          state.paymentMethod === "bank_card"
            ? false
            : state.bankCardSaveForLater,
        bankCardMetadata: null,
        completedOrder: null,
        failureMessage: null,
      };

    case "payment_submitted": {
      if (state.step !== "payment_selection") {
        return state;
      }

      const validation = validateDeliveryInformation(state.delivery);
      if (!validation.valid) {
        return {
          ...state,
          step: "delivery",
          deliveryErrors: validation.errors,
        };
      }

      const paymentMethod = getPaymentMethod(state.paymentMethod);
      if (paymentMethod.availability !== "implemented") {
        return {
          ...state,
          step: "payment_selection",
          deliveryErrors: {},
          completedOrder: null,
          failureMessage: null,
        };
      }

      return {
        ...state,
        step: paymentMethod.requiresExtraSteps
          ? "payment_details"
          : "processing",
        deliveryErrors: {},
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "vodafone_cash_details_submitted": {
      if (
        state.step !== "payment_details" ||
        state.paymentMethod !== "vodafone_cash"
      ) {
        return state;
      }

      const deliveryValidation = validateDeliveryInformation(state.delivery);
      if (!deliveryValidation.valid) {
        return {
          ...state,
          step: "delivery",
          deliveryErrors: deliveryValidation.errors,
        };
      }

      const vodafoneValidation = validateVodafoneCashDetails(
        state.vodafoneCashDetails,
      );
      if (!vodafoneValidation.valid) {
        return {
          ...state,
          vodafoneCashErrors: vodafoneValidation.errors,
        };
      }

      return {
        ...state,
        step: "order_review",
        deliveryErrors: {},
        vodafoneCashErrors: {},
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "instapay_details_submitted": {
      if (
        state.step !== "payment_details" ||
        state.paymentMethod !== "instapay"
      ) {
        return state;
      }

      const deliveryValidation = validateDeliveryInformation(state.delivery);
      if (!deliveryValidation.valid) {
        return {
          ...state,
          step: "delivery",
          deliveryErrors: deliveryValidation.errors,
        };
      }

      const instapayValidation = validateInstapayDetails(
        state.instapayDetails,
      );
      if (!instapayValidation.valid) {
        return {
          ...state,
          instapayErrors: instapayValidation.errors,
        };
      }

      return {
        ...state,
        step: "order_review",
        deliveryErrors: {},
        instapayErrors: {},
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "bank_card_details_submitted": {
      if (
        state.step !== "payment_details" ||
        state.paymentMethod !== "bank_card"
      ) {
        return state;
      }

      const deliveryValidation = validateDeliveryInformation(state.delivery);
      if (!deliveryValidation.valid) {
        return {
          ...state,
          step: "delivery",
          deliveryErrors: deliveryValidation.errors,
        };
      }

      const bankCardValidation = validateBankCardDetails(
        state.bankCardDetails,
      );
      const bankCardMetadata = createSafeCardMetadata(
        state.bankCardDetails,
      );

      if (!bankCardValidation.valid || !bankCardMetadata) {
        return {
          ...state,
          bankCardErrors: bankCardValidation.errors,
          bankCardMetadata: null,
        };
      }

      return {
        ...state,
        step: "order_review",
        deliveryErrors: {},
        bankCardErrors: {},
        bankCardMetadata,
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "order_review_submitted": {
      if (state.step !== "order_review") {
        return state;
      }

      const deliveryValidation = validateDeliveryInformation(state.delivery);

      if (!deliveryValidation.valid) {
        return {
          ...state,
          step: "delivery",
          deliveryErrors: deliveryValidation.errors,
        };
      }

      if (state.paymentMethod === "vodafone_cash") {
        const vodafoneValidation = validateVodafoneCashDetails(
          state.vodafoneCashDetails,
        );

        if (!vodafoneValidation.valid) {
          return {
            ...state,
            step: "payment_details",
            vodafoneCashErrors: vodafoneValidation.errors,
          };
        }
      } else if (state.paymentMethod === "instapay") {
        const instapayValidation = validateInstapayDetails(
          state.instapayDetails,
        );

        if (!instapayValidation.valid) {
          return {
            ...state,
            step: "payment_details",
            instapayErrors: instapayValidation.errors,
          };
        }
      } else if (state.paymentMethod === "bank_card") {
        const bankCardValidation = validateBankCardDetails(
          state.bankCardDetails,
        );
        const bankCardMetadata = createSafeCardMetadata(
          state.bankCardDetails,
        );

        if (!bankCardValidation.valid || !bankCardMetadata) {
          return {
            ...state,
            step: "payment_details",
            bankCardErrors: bankCardValidation.errors,
            bankCardMetadata: null,
          };
        }
      } else {
        return state;
      }

      return {
        ...state,
        step: "processing",
        deliveryErrors: {},
        vodafoneCashErrors: {},
        instapayErrors: {},
        bankCardDetails: { ...EMPTY_BANK_CARD_DETAILS },
        bankCardErrors: {},
        bankCardSaveForLater: false,
        completedOrder: null,
        failureMessage: null,
      };
    }

    case "order_succeeded":
      if (state.step !== "processing") {
        return state;
      }

      return {
        ...state,
        step: "success",
        completedOrder: action.order,
        failureMessage: null,
      };

    case "order_failed":
      if (state.step !== "processing") {
        return state;
      }

      return {
        ...state,
        step: "failure",
        completedOrder: null,
        failureMessage: action.message,
      };

    case "retry_requested":
      if (state.step !== "failure") {
        return state;
      }

      return {
        ...state,
        step: "payment_selection",
        vodafoneCashErrors: {},
        instapayErrors: {},
        bankCardDetails:
          state.paymentMethod === "bank_card"
            ? preserveSafeBankCardDraft(state.bankCardDetails)
            : state.bankCardDetails,
        bankCardErrors: {},
        bankCardSaveForLater:
          state.paymentMethod === "bank_card"
            ? false
            : state.bankCardSaveForLater,
        bankCardMetadata: null,
        completedOrder: null,
        failureMessage: null,
      };

    case "checkout_reset":
      return createInitialCheckoutState(
        action.delivery ?? EMPTY_DELIVERY_INFORMATION,
      );

    default:
      return state;
  }
}
