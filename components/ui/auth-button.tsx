import type { ButtonHTMLAttributes, ReactNode } from "react";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "outline";
  size?: "default" | "compact";
};

export function AuthButton({
  children,
  className = "",
  size = "default",
  variant = "primary",
  type = "button",
  ...props
}: AuthButtonProps) {
  const classes =
    variant === "primary"
      ? "bg-auth-accent text-white border-auth-accent"
      : "bg-white text-auth-ink border-auth-ink";
  const height = size === "compact" ? "h-14" : "h-auth-field";

  return (
    <button
      className={`flex ${height} w-full items-center justify-center gap-3 rounded-md border text-xl font-semibold transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-link focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${classes} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
