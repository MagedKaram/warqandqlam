import { SelectedPaymentMethodSummary } from "@/components/checkout/SelectedPaymentMethodSummary";
import { getBankCardBrandLabel } from "@/lib/checkout/bank-card";
import type {
  DeliveryInformation,
  PaymentMethodId,
  SafeCardMetadata,
} from "@/types/checkout";

type OrderReviewProps = {
  canChangePaymentMethod?: boolean;
  delivery: DeliveryInformation;
  paymentMethodId: PaymentMethodId;
  paymentMethodLabel: string;
  onChangePaymentMethod: () => void;
  safeCardMetadata?: SafeCardMetadata | null;
};

function ReviewValue({
  isolate = false,
  label,
  value,
}: {
  isolate?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-baseline gap-2">
      <dt className="shrink-0 text-start font-bold text-auth-ink">{label}:</dt>
      <dd className="min-w-0 text-start font-semibold text-auth-ink">
        {isolate ? (
          <bdi
            className="inline-block max-w-full break-all align-bottom"
            dir="ltr"
          >
            {value}
          </bdi>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function OrderReview({
  canChangePaymentMethod = true,
  delivery,
  onChangePaymentMethod,
  paymentMethodId,
  paymentMethodLabel,
  safeCardMetadata,
}: OrderReviewProps) {
  return (
    <section className="min-w-0" aria-labelledby="order-review-title">
      <h1
        className="w-full text-start font-heading text-4xl font-bold text-auth-ink sm:text-5xl"
        id="order-review-title"
      >
        مراجعة الطلب
      </h1>

      <section
        className="mt-10 min-w-0"
        aria-labelledby="order-review-delivery-title"
      >
        <h2
          className="w-full text-start font-heading text-3xl font-bold text-auth-ink"
          id="order-review-delivery-title"
        >
          معلومات التوصيل
        </h2>

        <dl className="mt-5 grid min-w-0 gap-x-10 gap-y-5 text-base leading-7 sm:grid-cols-2">
          <ReviewValue label="الاسم" value={delivery.fullName} />
          <ReviewValue isolate label="رقم الهاتف" value={delivery.phone} />
          <div className="min-w-0 sm:col-span-2">
            <ReviewValue
              isolate
              label="البريد الإلكتروني"
              value={delivery.email}
            />
          </div>
          <div className="min-w-0 sm:col-span-2">
            <ReviewValue label="العنوان" value={delivery.address} />
          </div>
        </dl>
      </section>

      <section
        className="mt-7 min-w-0"
        aria-labelledby="order-review-payment-title"
      >
        <h2
          className="w-full text-start font-heading text-3xl font-bold text-auth-ink"
          id="order-review-payment-title"
        >
          طريقة الدفع
        </h2>

        <SelectedPaymentMethodSummary
          canChangePaymentMethod={canChangePaymentMethod}
          changeLabel="تغيير"
          className="mt-5"
          label={paymentMethodLabel}
          methodId={paymentMethodId}
          onChangePaymentMethod={onChangePaymentMethod}
        />

        {safeCardMetadata ? (
          <div
            className="mt-3 flex min-w-0 flex-wrap items-baseline gap-2 text-base font-semibold text-auth-ink"
            data-bank-card-summary
          >
            <span className="shrink-0 font-bold">البطاقة:</span>
            <bdi className="min-w-0 break-all" dir="ltr">
              {safeCardMetadata.brand
                ? getBankCardBrandLabel(safeCardMetadata.brand)
                : "Card"} {" "}
              •••• {safeCardMetadata.last4}
            </bdi>
          </div>
        ) : null}
      </section>
    </section>
  );
}
