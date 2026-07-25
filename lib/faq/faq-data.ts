import type { FaqCategory, FaqItem } from "@/types/faq";

export const faqItems = [
  {
    id: "delivery-time",
    question: "كم تستغرق عملية التوصيل؟",
    answer:
      "عادة نقوم بالتوصيل خلال 24-48 ساعة داخل القاهرة والجيزة، و3-5 أيام للمحافظات.",
  },
  {
    id: "instant-printing",
    question: "هل تقدمون خدمة طباعة فورية؟",
    answer:
      "نعم، نوفر خدمة الطباعة الفورية لبعض الطلبات حسب حجم الملفات وتوفر أقرب فرع.",
  },
  {
    id: "payment-methods",
    question: "ما هي طرق الدفع المتاحة؟",
    answer:
      "يمكنك الدفع نقداً عند الاستلام أو باستخدام طرق الدفع الإلكتروني المتاحة داخل المتجر.",
  },
  {
    id: "returns",
    question: "هل يمكن إرجاع المنتجات؟",
    answer:
      "يمكن إرجاع المنتجات خلال فترة الاستبدال إذا كانت بحالتها الأصلية ووفق سياسة المتجر.",
  },
] satisfies readonly FaqItem[];

export const faqCategories = [
  {
    id: "general",
    title: "أسئلة عامة",
    items: faqItems,
  },
  {
    id: "orders-shipping",
    title: "الطلبات والشحن",
    items: faqItems,
  },
  {
    id: "payment-returns",
    title: "الدفع والاسترجاع",
    items: faqItems,
  },
] satisfies readonly FaqCategory[];
