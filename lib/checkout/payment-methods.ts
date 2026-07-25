import type { PaymentMethodId } from "@/types/checkout";
import { BANK_CARD_CONFIG } from "@/lib/checkout/bank-card";

export type PaymentMethodMarkAsset = {
  src: string;
  width: number;
  height: number;
};

export type PaymentMethodMarkConfig =
  | {
      kind: "cash_icon";
    }
  | {
      kind: "bank_card_icon";
    }
  | {
      kind: "assets";
      assets: readonly PaymentMethodMarkAsset[];
    };

export type PaymentMethodAvailability =
  | "implemented"
  | "pending_approved_flow";

export type PaymentMethodConfig = {
  id: PaymentMethodId;
  label: string;
  labelDirection?: "ltr";
  mark: PaymentMethodMarkConfig;
  availability: PaymentMethodAvailability;
  requiresExtraSteps: boolean;
};

export const PAYMENT_METHODS = [
  {
    id: "cash_on_delivery",
    label: "الدفع عند الاستلام",
    mark: { kind: "cash_icon" },
    availability: "implemented",
    requiresExtraSteps: false,
  },
  {
    id: "vodafone_cash",
    label: "فودافون كاش",
    mark: {
      kind: "assets",
      assets: [
        {
          src: "/assets/images/payment/streamline-logos_vodafone-logo-block.svg",
          width: 24,
          height: 24,
        },
      ],
    },
    availability: "implemented",
    requiresExtraSteps: true,
  },
  {
    id: "instapay",
    label: "Instapay",
    labelDirection: "ltr",
    mark: {
      kind: "assets",
      assets: [
        {
          src: "/assets/images/payment/instapay.png",
          width: 40,
          height: 40,
        },
      ],
    },
    availability: "implemented",
    requiresExtraSteps: true,
  },
  {
    id: "bank_card",
    label: "بطاقة بنكية",
    mark: {
      kind: "assets",
      assets: BANK_CARD_CONFIG.supportedBrands.map((brand) => brand.asset),
    },
    availability: "implemented",
    requiresExtraSteps: true,
  },
] as const satisfies readonly PaymentMethodConfig[];

export const DEFAULT_PAYMENT_METHOD_ID: PaymentMethodId = "cash_on_delivery";

export function getPaymentMethod(
  id: PaymentMethodId,
): PaymentMethodConfig {
  return PAYMENT_METHODS.find((method) => method.id === id) ?? PAYMENT_METHODS[0];
}

export function isImplementedPaymentMethod(id: PaymentMethodId) {
  return getPaymentMethod(id).availability === "implemented";
}
