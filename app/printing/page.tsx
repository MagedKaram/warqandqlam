import type { Metadata } from "next";
import { PrintingHero } from "@/components/printing/PrintingHero";
import { PrintingPageClient } from "@/components/printing/PrintingPageClient";

export const metadata: Metadata = {
  title: "الطباعة | ورقة وقلم",
  description: "اطلب طباعة ملفاتك من ورقة وقلم بخطوات بسيطة.",
};

export default function PrintingPage() {
  return (
    <main className="bg-white text-foreground">
      <PrintingHero />
      <PrintingPageClient />
    </main>
  );
}
