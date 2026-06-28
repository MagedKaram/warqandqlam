"use client";

import type { CountryCode } from "libphonenumber-js";
import { FormEvent, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { AuthDivider } from "@/components/auth/auth-divider";
import { FooterLink } from "@/components/auth/footer-link";
import { AuthHeader } from "@/components/auth/auth-header";
import { SocialLogin } from "@/components/auth/social-login";
import { AuthButton } from "@/components/ui/auth-button";
import { AuthTextField, PasswordField } from "@/components/ui/auth-text-field";
import { PhoneField } from "@/components/signup/phone-field";

type SignupFormState = {
  name: string;
  email: string;
  country: CountryCode;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type SignupErrors = Partial<Record<keyof SignupFormState, string>>;

const initialState: SignupFormState = {
  name: "",
  email: "",
  country: "EG",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

function validateForm(form: SignupFormState): SignupErrors {
  const errors: SignupErrors = {};

  if (!form.name.trim()) {
    errors.name = "يرجى إدخال الاسم";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }

  if (!form.phone || !isValidPhoneNumber(form.phone)) {
    errors.phone = "يرجى إدخال رقم هاتف صحيح";
  }

  if (form.password.length < 8) {
    errors.password = "كلمة السر يجب ألا تقل عن 8 أحرف";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "كلمتا السر غير متطابقتين";
  }

  if (!form.acceptedTerms) {
    errors.acceptedTerms = "يجب الموافقة على الشروط";
  }

  return errors;
}

export function SignupForm() {
  const [form, setForm] = useState<SignupFormState>(initialState);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<Key extends keyof SignupFormState>(
    field: Key,
    value: SignupFormState[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: call the real signup API when the backend is available.
    setSubmitted(true);
  }

  return (
    <form className="w-full max-w-[34.5rem] space-y-6" noValidate onSubmit={handleSubmit}>
      <AuthHeader
        subtitle="يرجى تقديم جميع المعلومات المطلوبة لإنشاء حسابك"
        title="إنشاء حسابك الالكتروني"
      />

      <div className="space-y-5">
        <AuthTextField
          autoComplete="name"
          error={errors.name}
          label="الاسم"
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="اسمك"
          value={form.name}
        />
        <AuthTextField
          autoComplete="username"
          error={errors.email}
          label="البريد الالكتروني"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="بريدك الالكتروني"
          type="email"
          value={form.email}
        />
        <PhoneField
          country={form.country}
          error={errors.phone}
          onCountryChange={(value) => updateField("country", value)}
          onValueChange={(value) => updateField("phone", value)}
          value={form.phone}
        />
        <PasswordField
          autoComplete="new-password"
          error={errors.password}
          label="كلمة السر"
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="كلمة السر"
          value={form.password}
        />
        <PasswordField
          autoComplete="new-password"
          error={errors.confirmPassword}
          label="تأكيد كلمة السر"
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder="كلمة السر"
          value={form.confirmPassword}
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-center gap-3 text-base font-semibold text-auth-ink">
          <input
            checked={form.acceptedTerms}
            className="h-5 w-5 rounded border-auth-border accent-auth-accent"
            onChange={(event) => updateField("acceptedTerms", event.target.checked)}
            type="checkbox"
          />
          <span>
            أوافق على{" "}
            <a className="text-auth-link underline-offset-4 hover:underline" href="#">
              شروط الخدمة
            </a>{" "}
            و{" "}
            <a className="text-auth-link underline-offset-4 hover:underline" href="#">
              سياسة الخصوصية
            </a>
          </span>
        </label>
        {errors.acceptedTerms ? (
          <p className="text-center text-sm font-medium text-auth-accent">
            {errors.acceptedTerms}
          </p>
        ) : null}
      </div>

      <AuthButton type="submit">إنشئ حساب</AuthButton>

      {submitted ? (
        <p className="text-center text-sm font-semibold text-auth-link">
          تم تجهيز بيانات الحساب تجريبيا.
        </p>
      ) : null}

      <AuthDivider />
      <SocialLogin />
      <FooterLink href="/login" linkText="سجل دخول" text="لديك بريد بالفعل!" />
    </form>
  );
}
