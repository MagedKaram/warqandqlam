"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { PiTag, PiX } from "react-icons/pi";

type CouponStatus = "idle" | "processing" | "success" | "error";

type CouponControlProps = {
  appliedCode: string | null;
  onApply: (code: string) => boolean;
  onRemove: () => void;
};

export function CouponControl({
  appliedCode,
  onApply,
  onRemove,
}: CouponControlProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [code, setCode] = useState(appliedCode ?? "");
  const [status, setStatus] = useState<CouponStatus>(
    appliedCode ? "success" : "idle",
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setStatus("error");
      return;
    }

    setStatus("processing");
    timerRef.current = setTimeout(() => {
      setStatus(onApply(normalizedCode) ? "success" : "error");
    }, 250);
  }

  function handleRemove() {
    onRemove();
    setCode("");
    setStatus("idle");
  }

  return (
    <div>
      <form
        className={`flex min-w-0 items-center gap-2 rounded-md border bg-white p-2 transition focus-within:border-auth-link ${
          status === "error"
            ? "border-red-500"
            : status === "success"
              ? "border-auth-success"
              : "border-auth-border"
        }`}
        onSubmit={handleSubmit}
      >
        <PiTag aria-hidden className="shrink-0 text-2xl text-auth-muted" />
        <label className="sr-only" htmlFor="cart-coupon-code">
          كود الخصم
        </label>
        <input
          className="h-10 min-w-0 flex-1 bg-transparent px-1 text-start text-base font-semibold text-auth-ink outline-none placeholder:text-auth-muted"
          disabled={status === "processing" || Boolean(appliedCode)}
          id="cart-coupon-code"
          inputMode="text"
          onChange={(event) => {
            setCode(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="هل تمتلك كوبون خصم؟"
          value={code}
        />

        {appliedCode ? (
          <button
            aria-label="إزالة كود الخصم"
            className="flex h-10 shrink-0 items-center gap-1 rounded-md border border-auth-border px-3 text-sm font-bold text-auth-ink transition hover:border-red-500 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            onClick={handleRemove}
            type="button"
          >
            <PiX aria-hidden className="text-lg" />
            إزالة
          </button>
        ) : (
          <button
            className="h-10 shrink-0 rounded-md border border-auth-border bg-cool-200 px-4 text-sm font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent disabled:cursor-wait disabled:opacity-60"
            disabled={status === "processing"}
            type="submit"
          >
            {status === "processing" ? "جارٍ التفعيل..." : "تفعيل"}
          </button>
        )}
      </form>

      <p
        aria-live="polite"
        className={`mt-2 min-h-5 text-start text-sm font-semibold ${
          status === "error" ? "text-red-600" : "text-auth-success"
        }`}
      >
        {status === "success"
          ? "تم تطبيق كود الخصم بنجاح."
          : status === "error"
            ? "كود الخصم غير صالح. تحقق منه وحاول مرة أخرى."
            : ""}
      </p>
    </div>
  );
}
