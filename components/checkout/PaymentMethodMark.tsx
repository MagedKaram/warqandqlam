import Image from "next/image";
import { PiCreditCard, PiMoney } from "react-icons/pi";
import { getPaymentMethod } from "@/lib/checkout/payment-methods";
import type { PaymentMethodId } from "@/types/checkout";

type PaymentMethodMarkProps = {
  className?: string;
  methodId: PaymentMethodId;
};

export function PaymentMethodMark({
  className = "",
  methodId,
}: PaymentMethodMarkProps) {
  const mark = getPaymentMethod(methodId).mark;
  const Icon = mark.kind === "cash_icon" ? PiMoney : PiCreditCard;
  const iconMark = mark.kind === "cash_icon" || mark.kind === "bank_card_icon";

  return (
    <span
      aria-hidden
      className={`flex h-12 min-w-12 shrink-0 items-center justify-center gap-1 text-auth-ink ${
        iconMark ? "rounded-md bg-cool-200 px-2" : "bg-white"
      } ${className}`}
      dir={mark.kind === "assets" && mark.assets.length > 1 ? "ltr" : undefined}
    >
      {iconMark ? (
        <Icon className="text-2xl" />
      ) : (
        mark.assets.map((asset) => (
          <Image
            alt=""
            className="h-auto max-h-12 w-auto max-w-full shrink-0 object-contain"
            height={asset.height + 0}
            key={asset.src}
            src={asset.src}
            width={asset.width + 0}
          />
        ))
      )}
    </span>
  );
}
