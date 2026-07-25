"use client";

import type { RefObject } from "react";
import { PaymentMethodMark } from "@/components/checkout/PaymentMethodMark";
import {
  getPaymentMethod,
  PAYMENT_METHODS,
} from "@/lib/checkout/payment-methods";
import type { PaymentMethodId } from "@/types/checkout";

type PaymentMethodSelectorProps = {
  selectedMethod: PaymentMethodId;
  selectedInputRef?: RefObject<HTMLInputElement | null>;
  onSelect: (method: PaymentMethodId) => void;
};

export function PaymentMethodSelector({
  onSelect,
  selectedMethod,
  selectedInputRef,
}: PaymentMethodSelectorProps) {
  const pending =
    getPaymentMethod(selectedMethod).availability ===
    "pending_approved_flow";

  return (
    <section
      className="mt-7 min-w-0"
      aria-labelledby="payment-method-title"
      data-payment-method-selector
    >
      <fieldset className="min-w-0">
        <legend
          className="w-full text-start font-heading text-4xl font-bold text-auth-ink"
          id="payment-method-title"
        >
          طريقة الدفع
        </legend>

        <div className="mt-7 grid min-w-0 gap-4">
          {PAYMENT_METHODS.map((method) => {
            const selected = selectedMethod === method.id;

            return (
              <label
                className={`flex min-h-12 min-w-0 cursor-pointer items-center gap-3 rounded-md border bg-white px-4 py-2 text-start transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-auth-accent has-[:focus-visible]:ring-offset-2 ${
                  selected
                    ? "border-auth-ink"
                    : "border-auth-border hover:border-auth-accent"
                }`}
                key={method.id}
              >
                <input
                  checked={selected}
                  className="h-5 w-5 shrink-0 accent-auth-ink"
                  name="paymentMethod"
                  onChange={() => onSelect(method.id)}
                  ref={selected ? selectedInputRef : undefined}
                  type="radio"
                  value={method.id}
                />
                <span className="min-w-0 flex-1 text-base font-bold text-auth-ink">
                  {"labelDirection" in method &&
                  method.labelDirection === "ltr" ? (
                    <bdi dir="ltr">{method.label}</bdi>
                  ) : (
                    method.label
                  )}
                </span>
                <PaymentMethodMark methodId={method.id} />
              </label>
            );
          })}
        </div>
      </fieldset>

      {pending ? (
        <p
          aria-live="polite"
          className="mt-4 rounded-md border border-auth-border bg-cool-200 px-4 py-3 text-start text-sm font-semibold leading-6 text-auth-muted"
        >
          طريقة الدفع هذه ظاهرة للاختيار فقط. سيتم تنفيذ خطواتها بعد اعتماد
          التصميم والتدفق الخاص بها.
        </p>
      ) : null}
    </section>
  );
}
