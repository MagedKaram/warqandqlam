export const CART_STORAGE_KEY = "warqandqlam.cart";

export const LEGACY_PRINT_ORDER_STORAGE_KEY = "warqandqlam.printOrders";

export const CART_STORAGE_VERSION = 1 as const;

export const CART_CURRENCY = "LE" as const;

export const SHIPPING_PRICE = 60;

export const FREE_SHIPPING_THRESHOLD = 500;

export type CartCoupon = {
  code: string;
  label: string;
  discount:
    | {
        kind: "percentage";
        percentage: number;
      }
    | {
        amount: number;
        kind: "fixed";
      };
};

export const CART_COUPONS = [
  {
    code: "53347",
    label: "خصم 10%",
    discount: {
      kind: "percentage",
      percentage: 10,
    },
  },
] as const satisfies readonly CartCoupon[];

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export function getCartCoupon(code: string | null | undefined): CartCoupon | null {
  if (!code) {
    return null;
  }

  const normalizedCode = normalizeCouponCode(code);
  return CART_COUPONS.find((coupon) => coupon.code === normalizedCode) ?? null;
}
