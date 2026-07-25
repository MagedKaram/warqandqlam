import Link from "next/link";
import type { ReactNode } from "react";

type SectionButtonProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
};

export function SectionButton({ href, children, icon }: SectionButtonProps) {
  return (
    <Link
      className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-auth-accent px-6 text-base font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
      href={href}
      prefetch={false}
    >
      {children}
      {icon ? <span aria-hidden>{icon}</span> : null}
    </Link>
  );
}
