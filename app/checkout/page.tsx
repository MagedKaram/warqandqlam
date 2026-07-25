import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "إتمام الطلب | ورقة وقلم",
  description: "أدخل معلومات التوصيل واختر طريقة الدفع لإتمام طلبك.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
