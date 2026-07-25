import { FaqSection } from "@/components/faq/FaqSection";
import { faqCategories } from "@/lib/faq/faq-data";

export function FaqPage() {
  return (
    <main className="min-w-0 flex-1 bg-white text-auth-ink">
      <div className="mx-auto w-full min-w-0 max-w-[1240px] px-4 pt-10 pb-16 sm:pt-16 sm:pb-[140px] md:px-6 xl:px-0">
        <header className="w-full text-start">
          <h1 className="w-full text-start font-heading text-[34px] font-bold leading-[1.35] text-auth-ink sm:text-[40px]">
            الأسئلة الشائعة
          </h1>
          <p className="mt-2 w-full text-start font-body text-lg font-semibold leading-8 text-auth-muted sm:text-xl">
            إجابات على أكثر الأسئلة شيوعاً
          </p>
        </header>

        <div className="mt-10 space-y-12 sm:mt-16 sm:space-y-16">
          {faqCategories.map((category) => (
            <FaqSection category={category} key={category.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
