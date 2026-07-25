"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useId, useState } from "react";

type AuthTextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  trailing?: ReactNode;
};

export function AuthTextField({
  label,
  error,
  trailing,
  className = "",
  type = "text",
  ...props
}: AuthTextFieldProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label className="block text-start text-xl font-semibold text-auth-ink" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-auth-field w-full rounded-md border border-auth-border bg-white px-5 text-xl text-auth-ink outline-none transition placeholder:text-auth-muted focus:border-auth-link focus:ring-2 focus:ring-auth-link/20 ${trailing ? "ps-14" : ""} ${className}`}
          id={id}
          type={type}
          {...props}
        />
        {trailing ? (
          <div className="absolute start-4 top-1/2 -translate-y-1/2">{trailing}</div>
        ) : null}
      </div>
      {error ? (
        <p className="text-start text-sm font-medium text-auth-accent" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type PasswordFieldProps = Omit<AuthTextFieldProps, "type" | "trailing">;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthTextField
      type={visible ? "text" : "password"}
      trailing={
        <button
          aria-label={visible ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
          className="text-sm font-semibold text-auth-muted"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? "إخفاء" : "إظهار"}
        </button>
      }
      {...props}
    />
  );
}
