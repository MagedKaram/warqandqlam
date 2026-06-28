"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FooterLink } from "@/components/auth/footer-link";
import { SocialLogin } from "@/components/auth/social-login";
import { AuthButton } from "@/components/ui/auth-button";
import { AuthTextField, PasswordField } from "@/components/ui/auth-text-field";
import { isValidEmail } from "@/lib/auth-validation";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LoginErrors = {};

    if (!isValidEmail(email)) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!password) {
      nextErrors.password = "يرجى إدخال كلمة السر";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: call login API when the backend is available.
    router.push("/");
  }

  return (
    <AuthLayout>
      <form className="w-full max-w-[34.5rem] space-y-7" noValidate onSubmit={handleSubmit}>
        <AuthHeader
          subtitle="يرجى تقديم جميع المعلومات المطلوبة للوصول إلى حسابك"
          title="تسجيل الدخول"
        />

        <div className="space-y-6">
          <AuthTextField
            autoComplete="username"
            error={errors.email}
            label="البريد الالكتروني"
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="بريدك الالكتروني"
            type="email"
            value={email}
          />
          <div className="space-y-3">
            <PasswordField
              autoComplete="current-password"
              error={errors.password}
              label="كلمة السر"
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="كلمة السر"
              value={password}
            />
            <Link
              className="block text-right text-base font-semibold text-auth-ink hover:text-auth-link"
              href="/forgot-password"
            >
              هل نسيت كلمة السر؟
            </Link>
          </div>
        </div>

        <AuthButton type="submit">تسجيل دخول</AuthButton>
        <AuthDivider />
        <SocialLogin />
        <FooterLink href="/signup" linkText="انشئ حساب" text="ليس لديك حساب؟" />
      </form>
    </AuthLayout>
  );
}
