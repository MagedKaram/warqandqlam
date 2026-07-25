import type {
  BankCardBrand,
  BankCardDetails,
  BankCardDetailsErrors,
  BankCardValidationResult,
  SafeCardMetadata,
} from "@/types/checkout";

type SupportedBankCardBrand = {
  id: BankCardBrand;
  label: string;
  asset: {
    src: string;
    width: number;
    height: number;
  };
  cardNumberLengths: readonly number[];
  cvvLengths: readonly number[];
};

export const BANK_CARD_CONFIG = {
  detailsActionLabel: "المتابعة للدفع",
  prototypeProcessingDelayMs: 900,
  supportedBrands: [
    {
      id: "meeza",
      label: "Meeza",
      asset: {
        src: "/assets/images/payment/meeza.png",
        width: 38,
        height: 24,
      },
      cardNumberLengths: [16],
      cvvLengths: [3],
    },
    {
      id: "visa",
      label: "Visa",
      asset: {
        src: "/assets/images/payment/visa.png",
        width: 38,
        height: 24,
      },
      cardNumberLengths: [16],
      cvvLengths: [3],
    },
    {
      id: "mastercard",
      label: "Mastercard",
      asset: {
        src: "/assets/images/payment/master.png",
        width: 38,
        height: 24,
      },
      cardNumberLengths: [16],
      cvvLengths: [3],
    },
  ] satisfies readonly SupportedBankCardBrand[],
} as const;

export const EMPTY_BANK_CARD_DETAILS: BankCardDetails = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export const BANK_CARD_VALIDATION_MESSAGES = {
  cardholderRequired: "يرجى إدخال اسم حامل البطاقة.",
  cardNumberRequired: "يرجى إدخال رقم البطاقة.",
  cardNumberLength: "يرجى إدخال رقم بطاقة مكوّنًا من 16 رقمًا.",
  cardNumberUnsupported:
    "نوع البطاقة غير مدعوم. استخدم Meeza أو Visa أو Mastercard.",
  cardNumberInvalid: "رقم البطاقة غير صحيح.",
  expiryRequired: "يرجى إدخال تاريخ انتهاء البطاقة.",
  expiryIncomplete: "أدخل تاريخ الانتهاء بالصيغة MM/YY.",
  expiryMonthInvalid: "شهر انتهاء البطاقة غير صحيح.",
  expiryExpired: "انتهت صلاحية البطاقة.",
  cvvRequired: "يرجى إدخال رمز CVV.",
  cvvInvalid: "يرجى إدخال رمز CVV مكوّنًا من 3 أرقام.",
} as const;

const arabicIndicDigits = "٠١٢٣٤٥٦٧٨٩";
const easternArabicDigits = "۰۱۲۳۴۵۶۷۸۹";

export function normalizeCardDigits(value: string, maximumLength: number) {
  const asciiValue = value
    .replace(/[٠-٩]/g, (digit) =>
      String(arabicIndicDigits.indexOf(digit)),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String(easternArabicDigits.indexOf(digit)),
    );

  return asciiValue.replace(/\D/g, "").slice(0, maximumLength);
}

export function formatCardNumber(value: string) {
  return normalizeCardDigits(value, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatCardExpiry(value: string) {
  const digits = normalizeCardDigits(value, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
}

function isMastercardPrefix(cardNumber: string) {
  const firstTwoDigits = Number.parseInt(cardNumber.slice(0, 2), 10);
  const firstFourDigits = Number.parseInt(cardNumber.slice(0, 4), 10);

  return (
    (firstTwoDigits >= 51 && firstTwoDigits <= 55) ||
    (firstFourDigits >= 2221 && firstFourDigits <= 2720)
  );
}

export function detectBankCardBrand(
  cardNumber: string,
): BankCardBrand | null {
  const digits = normalizeCardDigits(cardNumber, 16);

  // The approved prototype has no production BIN table. This narrowly scoped
  // prefix keeps Meeza demonstrable without claiming real gateway support.
  if (digits.startsWith("507803")) {
    return "meeza";
  }

  if (digits.startsWith("4")) {
    return "visa";
  }

  if (isMastercardPrefix(digits)) {
    return "mastercard";
  }

  return null;
}

export function isValidLuhnNumber(cardNumber: string) {
  const digits = normalizeCardDigits(cardNumber, 19);
  if (!digits || /^0+$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let doubleDigit = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

export function getBankCardBrandLabel(brand: BankCardBrand) {
  return (
    BANK_CARD_CONFIG.supportedBrands.find((item) => item.id === brand)
      ?.label ?? brand
  );
}

export function validateBankCardDetails(
  details: BankCardDetails,
  now = new Date(),
): BankCardValidationResult {
  const errors: BankCardDetailsErrors = {};
  const cardholderName = details.cardholderName.trim();
  const cardNumber = normalizeCardDigits(details.cardNumber, 16);
  const expiry = normalizeCardDigits(details.expiry, 4);
  const cvv = normalizeCardDigits(details.cvv, 4);
  const brand = detectBankCardBrand(cardNumber);

  if (!cardholderName) {
    errors.cardholderName =
      BANK_CARD_VALIDATION_MESSAGES.cardholderRequired;
  }

  if (!cardNumber) {
    errors.cardNumber = BANK_CARD_VALIDATION_MESSAGES.cardNumberRequired;
  } else if (cardNumber.length !== 16) {
    errors.cardNumber = BANK_CARD_VALIDATION_MESSAGES.cardNumberLength;
  } else if (!brand) {
    errors.cardNumber = BANK_CARD_VALIDATION_MESSAGES.cardNumberUnsupported;
  } else if (!isValidLuhnNumber(cardNumber)) {
    errors.cardNumber = BANK_CARD_VALIDATION_MESSAGES.cardNumberInvalid;
  }

  if (!expiry) {
    errors.expiry = BANK_CARD_VALIDATION_MESSAGES.expiryRequired;
  } else if (expiry.length !== 4) {
    errors.expiry = BANK_CARD_VALIDATION_MESSAGES.expiryIncomplete;
  } else {
    const month = Number.parseInt(expiry.slice(0, 2), 10);
    const year = 2000 + Number.parseInt(expiry.slice(2), 10);
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (month < 1 || month > 12) {
      errors.expiry = BANK_CARD_VALIDATION_MESSAGES.expiryMonthInvalid;
    } else if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      errors.expiry = BANK_CARD_VALIDATION_MESSAGES.expiryExpired;
    }
  }

  if (!cvv) {
    errors.cvv = BANK_CARD_VALIDATION_MESSAGES.cvvRequired;
  } else {
    const supportedCvvLengths = brand
      ? BANK_CARD_CONFIG.supportedBrands.find((item) => item.id === brand)
          ?.cvvLengths
      : [3];

    if (!supportedCvvLengths?.includes(cvv.length as 3)) {
      errors.cvv = BANK_CARD_VALIDATION_MESSAGES.cvvInvalid;
    }
  }

  if (Object.keys(errors).length > 0 || !brand) {
    return { valid: false, brand, errors };
  }

  return { valid: true, brand, errors };
}

export function createSafeCardMetadata(
  details: BankCardDetails,
): SafeCardMetadata | null {
  const validation = validateBankCardDetails(details);
  if (!validation.valid) {
    return null;
  }

  const cardNumber = normalizeCardDigits(details.cardNumber, 16);
  return {
    method: "bank_card",
    brand: validation.brand,
    last4: cardNumber.slice(-4),
  };
}
