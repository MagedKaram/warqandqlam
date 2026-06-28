"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthButton } from "@/components/ui/auth-button";
import { AuthTextField } from "@/components/ui/auth-text-field";
import { isValidEmail } from "@/lib/auth-validation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    // TODO: call forgot password API when the backend is available.
    router.push("/verify-code");
  }

  return (
    <AuthLayout>
      <form className="w-full max-w-[34.5rem] space-y-7" noValidate onSubmit={handleSubmit}>
        <AuthHeader
          subtitle="لا تقلق، سنرسل لك رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني"
          title="نسيت كلمة المرور؟"
        />

        <AuthTextField
          autoComplete="username"
          error={error}
          label="البريد الالكتروني"
          onChange={(event) => {
            setEmail(event.target.value);
            setError(undefined);
          }}
          placeholder="بريدك الالكتروني"
          type="email"
          value={email}
        />

        <AuthButton type="submit">ارسل رابط اعادة التعيين</AuthButton>
        <AuthButton onClick={() => router.push("/login")} type="button" variant="outline">
          ← العودة لتسجيل دخول
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
