import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "السلة | ورقة وقلم",
  description: "سلة التسوق في نموذج واجهة ورقة وقلم.",
};

export default function CartPage() {
  return <CartPageClient />;
}
