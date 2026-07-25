"use client";

import { PiMinus, PiPlus } from "react-icons/pi";

export type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  labelledBy?: string;
};

function normalizeInteger(value: number, fallback: number) {
  return Number.isFinite(value) ? Math.floor(value) : fallback;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  loading = false,
  className = "",
  decrementLabel = "تقليل الكمية",
  incrementLabel = "زيادة الكمية",
  labelledBy,
}: QuantityStepperProps) {
  const normalizedMin = Math.max(0, normalizeInteger(min, 1));
  const normalizedMax =
    max === undefined || !Number.isFinite(max)
      ? undefined
      : Math.max(normalizedMin, normalizeInteger(max, normalizedMin));
  const normalizedValue = Math.min(
    normalizedMax ?? Number.POSITIVE_INFINITY,
    Math.max(normalizedMin, normalizeInteger(value, normalizedMin)),
  );
  const interactionDisabled = disabled || loading;
  const cannotDecrease = interactionDisabled || normalizedValue <= normalizedMin;
  const cannotIncrease =
    interactionDisabled ||
    (normalizedMax !== undefined && normalizedValue >= normalizedMax);

  function commit(nextValue: number) {
    if (interactionDisabled) {
      return;
    }

    const boundedValue = Math.min(
      normalizedMax ?? Number.POSITIVE_INFINITY,
      Math.max(normalizedMin, normalizeInteger(nextValue, normalizedValue)),
    );

    if (boundedValue !== normalizedValue) {
      onChange(boundedValue);
    }
  }

  return (
    <div
      aria-busy={loading || undefined}
      aria-disabled={interactionDisabled || undefined}
      aria-label={labelledBy ? undefined : "تعديل الكمية"}
      aria-labelledby={labelledBy}
      className={`flex h-11 w-[140px] max-w-full items-center justify-between rounded-md border border-auth-border bg-white ${
        interactionDisabled ? "opacity-60" : ""
      } ${className}`}
      role="group"
    >
      <button
        aria-label={decrementLabel}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-auth-ink transition hover:bg-cool-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={cannotDecrease}
        onClick={() => commit(normalizedValue - 1)}
        type="button"
      >
        <PiMinus aria-hidden className="text-xl" />
      </button>

      <bdi
        aria-atomic="true"
        aria-live="polite"
        className="min-w-8 text-center font-body text-lg font-bold text-auth-ink"
        dir="ltr"
      >
        {normalizedValue}
      </bdi>

      <button
        aria-label={incrementLabel}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-auth-ink transition hover:bg-cool-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={cannotIncrease}
        onClick={() => commit(normalizedValue + 1)}
        type="button"
      >
        <PiPlus aria-hidden className="text-xl" />
      </button>
    </div>
  );
}
