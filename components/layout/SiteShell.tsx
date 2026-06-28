"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

const authRoutes = new Set([
  "/signup",
  "/login",
  "/forgot-password",
  "/verify-code",
  "/reset-password",
]);

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = !authRoutes.has(pathname);

  return (
    <>
      {showHeader ? <Header /> : null}
      {children}
    </>
  );
}
