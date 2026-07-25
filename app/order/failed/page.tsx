import type { Metadata } from "next";
import { OrderResultView } from "@/components/order/OrderResultView";

export const metadata: Metadata = {
  title: "تعذر إتمام الطلب | ورقة وقلم",
  description: "إشعار بتعذر إتمام الطلب مع إمكانية العودة والمحاولة مجددًا.",
};

/**
 * Side-effect-free development preview for the failed-order state. Rendering
 * this route never submits an order or mutates the cart; its actions only
 * navigate back to a safe Checkout retry or payment-selection state.
 */
export default function OrderFailedPage() {
  return <OrderResultView status="failure" />;
}
