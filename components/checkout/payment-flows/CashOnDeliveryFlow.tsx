import { PiInfo } from "react-icons/pi";

export function CashOnDeliveryFlow() {
  return (
    <p className="mt-4 flex items-start gap-2 rounded-md bg-home-promo px-4 py-3 text-start text-sm font-semibold leading-6 text-auth-ink">
      <PiInfo aria-hidden className="mt-0.5 shrink-0 text-xl text-auth-accent" />
      <span>سيتم دفع قيمة الطلب عند الاستلام.</span>
    </p>
  );
}
