"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RoutePreloader } from "@/components/layout/RoutePreloader";

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
      <RoutePreloader />
      {showHeader ? <Header /> : null}
      {children}
      {showHeader ? <Footer /> : null}
    </>
  );
}
