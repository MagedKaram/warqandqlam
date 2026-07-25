import {
  CART_CURRENCY,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_PRICE,
  getCartCoupon,
} from "@/lib/cart/cart-config";
import type {
  CartItem,
  CartState,
  CartTotals,
  PrintingCartAggregate,
} from "@/types/cart";
import type {
  BindingType,
  PaperSize,
  PaperType,
  PrintMode,
} from "@/types/printing";

export function roundCartMoney(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return Math.round((safeValue + Number.EPSILON) * 100) / 100;
}

export function formatCartMoney(value: number) {
  const roundedValue = roundCartMoney(value);

  return `${roundedValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(roundedValue) ? 0 : 1,
  })} ${CART_CURRENCY}`;
}

export function selectCartLineCount(state: Pick<CartState, "items">) {
  return state.items.length;
}

/**
 * Product quantities count as units. A printing job counts as one cart unit;
 * its copy count is printing configuration, not a retail line quantity.
 */
export function selectCartUnitCount(state: Pick<CartState, "items">) {
  return state.items.reduce(
    (count, item) => count + (item.kind === "product" ? item.quantity : 1),
    0,
  );
}

export function calculateProductSubtotal(items: readonly CartItem[]) {
  return roundCartMoney(
    items.reduce((subtotal, item) => {
      if (item.kind !== "product") {
        return subtotal;
      }

      return subtotal + item.unitPrice * item.quantity;
    }, 0),
  );
}

export function calculatePrintingSubtotal(items: readonly CartItem[]) {
  return roundCartMoney(
    items.reduce(
      (subtotal, item) =>
        subtotal + (item.kind === "printing" ? item.priceQuote.total : 0),
      0,
    ),
  );
}

export function calculateCartDiscount(subtotal: number, couponCode: string | null) {
  const coupon = getCartCoupon(couponCode);

  if (!coupon || subtotal <= 0) {
    return 0;
  }

  const unboundedDiscount =
    coupon.discount.kind === "percentage"
      ? subtotal * (coupon.discount.percentage / 100)
      : coupon.discount.amount;

  return roundCartMoney(Math.min(subtotal, Math.max(0, unboundedDiscount)));
}

export function calculateCartTotals(state: Pick<CartState, "couponCode" | "items">): CartTotals {
  const productSubtotal = calculateProductSubtotal(state.items);
  const printingSubtotal = calculatePrintingSubtotal(state.items);
  const subtotal = roundCartMoney(productSubtotal + printingSubtotal);
  const appliedCoupon = getCartCoupon(state.couponCode);
  const discount = calculateCartDiscount(subtotal, appliedCoupon?.code ?? null);
  const hasFreeShipping = subtotal > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = subtotal === 0 || hasFreeShipping ? 0 : SHIPPING_PRICE;

  return {
    productSubtotal,
    printingSubtotal,
    subtotal,
    discount,
    shipping,
    total: roundCartMoney(Math.max(0, subtotal - discount) + shipping),
    amountUntilFreeShipping: roundCartMoney(
      Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    ),
    hasFreeShipping,
    appliedCouponCode: appliedCoupon?.code ?? null,
  };
}

export function getFreeShippingMessage(totals: CartTotals) {
  if (totals.subtotal <= 0) {
    return null;
  }

  if (totals.hasFreeShipping) {
    return "لقد حصلت على شحن مجاني.";
  }

  return `أضف منتجات بقيمة ${formatCartMoney(totals.amountUntilFreeShipping)} للحصول على شحن مجاني.`;
}

export function getPrintingCartAggregate(
  items: readonly CartItem[],
): PrintingCartAggregate {
  const printModes = new Set<PrintMode>();
  const paperSizes = new Set<PaperSize>();
  const paperTypes = new Set<PaperType>();
  const bindingTypes = new Set<BindingType>();

  let orderCount = 0;
  let fileCount = 0;
  let totalPages = 0;
  let totalCopies = 0;
  let totalPrintedPages = 0;

  for (const item of items) {
    if (item.kind !== "printing") {
      continue;
    }

    const orderPageCount = item.files.reduce(
      (pageCount, file) => pageCount + file.pageCount,
      0,
    );

    orderCount += 1;
    fileCount += item.files.length;
    totalPages += orderPageCount;
    totalCopies += item.options.copies;
    totalPrintedPages += orderPageCount * item.options.copies;
    printModes.add(item.options.printMode);
    paperSizes.add(item.options.paperSize);
    paperTypes.add(item.options.paperType);
    bindingTypes.add(item.options.binding);
  }

  return {
    orderCount,
    fileCount,
    totalPages,
    totalCopies,
    totalPrintedPages,
    printModes: Array.from(printModes),
    paperSizes: Array.from(paperSizes),
    paperTypes: Array.from(paperTypes),
    bindingTypes: Array.from(bindingTypes),
  };
}
