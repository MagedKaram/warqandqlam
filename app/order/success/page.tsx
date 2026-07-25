import type { Metadata } from "next";
import { OrderResultView } from "@/components/order/OrderResultView";

export const metadata: Metadata = {
  title: "تم تأكيد الطلب | ورقة وقلم",
  description: "تأكيد استلام طلبك في نموذج واجهة ورقة وقلم.",
};

export default function OrderSuccessPage() {
  return <OrderResultView status="success" />;
}
