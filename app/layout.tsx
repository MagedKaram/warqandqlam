import type { Metadata } from "next";
import { Amiri, Cairo } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-heading",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ورقة وقلم",
  description: "واجهة متجر ورقة وقلم للقرطاسية والكتب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
