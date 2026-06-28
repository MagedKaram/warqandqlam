"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthButton } from "@/components/ui/auth-button";
import { AuthTextField } from "@/components/ui/auth-text-field";
import { isValidVerificationCode } from "@/lib/auth-validation";

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [resent, setResent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidVerificationCode(code)) {
      setError("يرجى إدخال رمز تحقق مكون من 4 أرقام");
      return;
    }

    // TODO: call verify code API when the backend is available.
    router.push("/reset-password");
  }

  return (
    <AuthLayout>
      <form className="w-full max-w-[36.5rem] space-y-7" noValidate onSubmit={handleSubmit}>
        <AuthHeader
          compact
          subtitle="أدخل رمز التحقق المكوّن من 4 أرقام الذي تم إرساله إلى بريدك الإلكتروني"
          title="أدخل رمز التحقق المكوّن من 4 أرقام"
        />

        <AuthTextField
          autoComplete="one-time-code"
          error={error}
          inputMode="numeric"
          label="رمز التحقق"
          maxLength={4}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, "").slice(0, 4));
            setError(undefined);
          }}
          placeholder="رمز التحقق"
          value={code}
        />

        <AuthButton type="submit">المتابعة</AuthButton>

        <p className="text-center text-xl font-semibold text-auth-ink">
          لم تستلم الرمز بعد؟{" "}
          <button
            className="text-auth-link underline-offset-4 hover:underline"
            onClick={() => setResent(true)}
            type="button"
          >
            إعادة إرسال الرمز
          </button>
        </p>
        {resent ? (
          <p className="text-center text-sm font-semibold text-auth-muted">
            تم إرسال رمز تحقق جديد تجريبيا.
          </p>
        ) : null}
      </form>
    </AuthLayout>
  );
}
