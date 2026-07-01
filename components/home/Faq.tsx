"use client";

import { useState } from "react";
import { faqItems } from "@/lib/mock-data";

export function Faq() {
  const [openId, setOpenId] = useState(faqItems[0]?.id);

  return (
    <section className="bg-white px-6 py-24 md:px-10" id="faq">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-auth-ink md:text-5xl">
            الأسئلة الشائعة
          </h2>
          <p className="mt-5 text-xl font-semibold text-auth-muted">
            إجابات على أكثر الأسئلة شيوعاً
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {faqItems.map((item) => {
            const isOpen = item.id === openId;

            return (
              <article
                className={`rounded-lg border bg-white transition ${
                  isOpen ? "border-auth-accent" : "border-auth-border/70"
                }`}
                key={item.id}
              >
                <button
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-8 py-6 text-right focus:outline-none"
                  onClick={() => setOpenId(isOpen ? "" : item.id)}
                  type="button"
                >
                  <span className="font-body text-xl font-bold text-auth-ink">
                    {item.question}
                  </span>
                  <span className="text-3xl leading-none text-auth-ink">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-8 pb-6 font-body text-xl font-bold leading-9 text-auth-ink">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
