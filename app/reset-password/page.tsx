"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthButton } from "@/components/ui/auth-button";
import { Modal } from "@/components/ui/modal";
import { PasswordField } from "@/components/ui/auth-text-field";
import { isValidPassword } from "@/lib/auth-validation";

type ResetErrors = {
  password?: string;
  confirmPassword?: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetErrors>({});
  const [successOpen, setSuccessOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ResetErrors = {};

    if (!isValidPassword(password)) {
      nextErrors.password = "كلمة السر يجب ألا تقل عن 8 أحرف";
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "كلمتا السر غير متطابقتين";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: call reset password API when the backend is available.
    setSuccessOpen(true);
  }

  return (
    <>
      <AuthLayout>
        <form className="w-full max-w-[34.5rem] space-y-8" noValidate onSubmit={handleSubmit}>
          <AuthHeader
            subtitle="قم بتعيين كلمة مرور جديدة لحسابك حتى تتمكن من تسجيل الدخول"
            title="إعادة تعيين كلمة المرور"
          />

          <div className="space-y-8">
            <PasswordField
              autoComplete="new-password"
              error={errors.password}
              label="كلمة السر الجديدة"
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="كلمة السر"
              value={password}
            />
            <PasswordField
              autoComplete="new-password"
              error={errors.confirmPassword}
              label="تأكيد كلمة السر"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setErrors((current) => ({ ...current, confirmPassword: undefined }));
              }}
              placeholder="كلمة السر"
              value={confirmPassword}
            />
          </div>

          <AuthButton type="submit">المتابعة</AuthButton>
        </form>
      </AuthLayout>

      <Modal
        labelledBy="reset-success-title"
        onClose={() => setSuccessOpen(false)}
        open={successOpen}
      >
        <section className="w-full max-w-[42rem] rounded-[2rem] bg-white px-8 py-14 text-center sm:px-12">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8 border-auth-success bg-auth-success-soft">
            <span className="text-6xl font-black text-auth-success">✓</span>
          </div>
          <h2 className="mt-10 text-4xl font-bold text-auth-ink" id="reset-success-title">
            تم تغيير كلمة المرور بنجاح
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-3xl font-semibold leading-relaxed text-auth-muted">
            يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول إلى حسابك
          </p>
          <AuthButton
            className="mt-10"
            onClick={() => router.push("/login")}
            type="button"
          >
            تسجيل الدخول
          </AuthButton>
        </section>
      </Modal>
    </>
  );
}
