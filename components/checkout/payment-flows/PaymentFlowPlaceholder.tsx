import type { PaymentMethodConfig } from "@/lib/checkout/payment-methods";

export function PaymentFlowPlaceholder({
  method,
}: {
  method: PaymentMethodConfig;
}) {
  return (
    <div
      className="mt-5 rounded-md border border-auth-border bg-cool-200 px-4 py-4 text-start"
      role="status"
    >
      <p className="font-bold text-auth-ink">{method.label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-auth-muted">
        التدفق التفصيلي لهذه الطريقة لم يُعتمد بعد، لذلك لم تتم إضافة أي حقول
        أو خطوات دفع افتراضية.
      </p>
    </div>
  );
}
