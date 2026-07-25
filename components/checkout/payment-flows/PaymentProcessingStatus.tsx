import { SelectedPaymentMethodRow } from "@/components/checkout/SelectedPaymentMethodRow";
import { getPaymentMethod } from "@/lib/checkout/payment-methods";
import type { PaymentMethodId } from "@/types/checkout";

type PaymentProcessingStatusProps = {
  paymentMethod: PaymentMethodId;
};

/**
 * Local frontend status only. It deliberately does not imply that a bank or
 * payment provider has verified the transfer.
 */
export function PaymentProcessingStatus({
  paymentMethod,
}: PaymentProcessingStatusProps) {
  const method = getPaymentMethod(paymentMethod);

  return (
    <section
      aria-labelledby="prototype-processing-title"
      className="min-w-0"
      data-payment-processing={paymentMethod}
    >
      <h1
        className="w-full text-start font-heading text-4xl font-bold text-auth-ink sm:text-5xl"
        id="prototype-processing-title"
      >
        جارٍ تأكيد الطلب
      </h1>

      <SelectedPaymentMethodRow
        className="mt-8"
        methodId={paymentMethod}
      />

      <div
        aria-live="polite"
        className="mt-8 flex min-h-64 min-w-0 flex-col items-center justify-center rounded-lg border border-auth-border bg-cool-200/30 px-5 py-10 text-center"
        role="status"
      >
        <span
          aria-hidden
          className="h-12 w-12 animate-spin rounded-full border-4 border-auth-border border-t-auth-accent"
        />
        <p className="mt-6 text-xl font-bold text-auth-ink">
          جارٍ إنشاء الطلب التجريبي
        </p>
        <p className="mt-3 max-w-lg text-sm font-semibold leading-7 text-auth-muted sm:text-base">
          {paymentMethod === "bank_card" ? (
            <>
              ننشئ طلبًا تجريبيًا فقط من دون الاتصال ببنك أو خصم أي مبلغ.
              لا يتم حفظ رقم البطاقة أو تاريخ الانتهاء أو رمز{" "}
              <bdi dir="ltr">CVV</bdi>.
            </>
          ) : (
            <>
              نحفظ بيانات الطلب على هذا الجهاز. لا يتم التحقق من التحويل
              عبر{" "}
              {method.labelDirection === "ltr" ? (
                <bdi dir="ltr">{method.label}</bdi>
              ) : (
                method.label
              )}{" "}
              أو الاتصال بخدمة بنكية في هذه النسخة.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
