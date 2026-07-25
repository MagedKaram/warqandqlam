import { SelectedPaymentMethodRow } from "@/components/checkout/SelectedPaymentMethodRow";
import { getPaymentMethod } from "@/lib/checkout/payment-methods";
import type { PaymentMethodId } from "@/types/checkout";

type SelectedPaymentMethodSummaryProps = {
  canChangePaymentMethod?: boolean;
  changeLabel?: string;
  className?: string;
  label?: string;
  methodId: PaymentMethodId;
  onChangePaymentMethod: () => void;
};

export function SelectedPaymentMethodSummary({
  canChangePaymentMethod = true,
  changeLabel = "تغيير طريقة الدفع",
  className = "",
  label,
  methodId,
  onChangePaymentMethod,
}: SelectedPaymentMethodSummaryProps) {
  const displayedLabel = label ?? getPaymentMethod(methodId).label;

  return (
    <div
      className={`grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${className}`}
    >
      <SelectedPaymentMethodRow label={label} methodId={methodId} />
      {canChangePaymentMethod ? (
        <button
          aria-label={`تغيير طريقة الدفع، الطريقة الحالية: ${displayedLabel}`}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-auth-accent bg-white px-4 py-2 text-sm font-bold text-auth-accent transition hover:bg-home-promo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 sm:w-auto"
          onClick={onChangePaymentMethod}
          type="button"
        >
          {changeLabel}
        </button>
      ) : null}
    </div>
  );
}
