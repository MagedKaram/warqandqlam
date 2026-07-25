import type { CartItem, CartTotals } from "@/types/cart";
import type {
  DeliveryInformation,
  PaymentMethodId,
  PrototypePaymentDetails,
  PrototypeOrder,
} from "@/types/checkout";

function createReadableOrderId(now: Date) {
  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = globalThis.crypto?.randomUUID?.().slice(0, 6).toUpperCase()
    ?? Math.random().toString(36).slice(2, 8).toUpperCase();

  return `WQ-${datePart}-${randomPart}`;
}

/**
 * Creates a serializable frontend prototype order only. No server order or
 * payment transaction is created in the current UI-only phase.
 */
export function createPrototypeOrder({
  delivery,
  items,
  paymentMethod,
  paymentDetails,
  totals,
}: {
  delivery: DeliveryInformation;
  items: CartItem[];
  paymentMethod: PaymentMethodId;
  paymentDetails?: PrototypePaymentDetails;
  totals: CartTotals;
}): PrototypeOrder {
  const now = new Date();

  return {
    orderId: createReadableOrderId(now),
    createdAt: now.toISOString(),
    source: "frontend_prototype",
    paymentMethod,
    ...(paymentDetails
      ? {
          paymentDetails:
            "method" in paymentDetails
              ? { ...paymentDetails }
              : {
                  ...paymentDetails,
                  receipt: { ...paymentDetails.receipt },
                },
        }
      : {}),
    delivery: { ...delivery },
    cart: {
      items: items.map((item) =>
        item.kind === "product"
          ? {
              ...item,
              selectedColor: item.selectedColor
                ? { ...item.selectedColor }
                : undefined,
            }
          : {
              ...item,
              files: item.files.map((file) => ({ ...file })),
              options: { ...item.options },
              priceQuote: { ...item.priceQuote },
            },
      ),
      totals: { ...totals },
    },
  };
}
