"use client";

import { useState } from "react";
import { faqItems } from "@/lib/faq/faq-data";

export function Faq() {
  const [openId, setOpenId] = useState(faqItems[0]?.id);

  return (
    <section className="bg-white px-6 py-24 md:px-10" id="faq">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-bold text-auth-ink md:text-5xl">
            الأسئلة الشائعة
          </h2>
          <p className="mt-5 text-xl font-semibold text-auth-muted">
            إجابات على أكثر الأسئلة شيوعاً
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {faqItems.map((item) => {
            const isOpen = item.id === openId;
            const triggerId = `home-faq-${item.id}-trigger`;
            const panelId = `home-faq-${item.id}-panel`;

            return (
              <article
                className={`rounded-lg border bg-white transition ${
                  isOpen ? "border-auth-accent" : "border-auth-border/70"
                }`}
                key={item.id}
              >
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-8 py-6 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-auth-accent"
                  id={triggerId}
                  onClick={() => setOpenId(isOpen ? "" : item.id)}
                  type="button"
                >
                  <span className="min-w-0 text-start font-body text-xl font-bold text-auth-ink">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-3xl leading-none text-auth-ink"
                  >
                    {isOpen ? "-" : "+"}
                  </span>
                </button>

                <div
                  aria-hidden={!isOpen}
                  aria-labelledby={triggerId}
                  className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                  id={panelId}
                  role="region"
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
