import type { Metadata } from "next";
import { FaqPage } from "@/components/faq/FaqPage";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | ورقة وقلم",
  description: "إجابات على أكثر الأسئلة شيوعاً في متجر ورقة وقلم.",
};

export default function FaqRoute() {
  return <FaqPage />;
}
