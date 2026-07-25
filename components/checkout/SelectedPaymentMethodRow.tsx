import { PaymentMethodMark } from "@/components/checkout/PaymentMethodMark";
import { getPaymentMethod } from "@/lib/checkout/payment-methods";
import type { PaymentMethodId } from "@/types/checkout";

type SelectedPaymentMethodRowProps = {
  className?: string;
  label?: string;
  methodId?: PaymentMethodId;
};

export function SelectedPaymentMethodRow({
  className = "",
  label,
  methodId,
}: SelectedPaymentMethodRowProps) {
  const method = methodId ? getPaymentMethod(methodId) : null;
  const displayedLabel = label ?? method?.label ?? "";

  return (
    <div
      aria-label={`طريقة الدفع المحددة: ${displayedLabel}`}
      className={`flex min-h-12 min-w-0 items-center gap-3 rounded-md border border-auth-ink bg-white px-4 py-2 text-start ${className}`}
      data-selected-payment-method={methodId}
      role="group"
    >
      <span
        aria-hidden
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-auth-ink"
      >
        <span className="h-3 w-3 rounded-full bg-auth-ink" />
      </span>
      <span className="min-w-0 flex-1 text-base font-bold text-auth-ink">
        {method?.labelDirection === "ltr" ? (
          <bdi dir="ltr">{displayedLabel}</bdi>
        ) : (
          displayedLabel
        )}
      </span>
      {methodId ? <PaymentMethodMark methodId={methodId} /> : null}
    </div>
  );
}
