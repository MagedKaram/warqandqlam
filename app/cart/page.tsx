import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "السلة | ورقة وقلم",
  description: "سلة التسوق في نموذج واجهة ورقة وقلم.",
};

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageClient />
    </CartProvider>
  );
}
