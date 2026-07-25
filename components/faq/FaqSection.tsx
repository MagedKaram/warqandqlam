"use client";

import { useState } from "react";
import { FaqAccordionItem } from "@/components/faq/FaqAccordionItem";
import type { FaqCategory } from "@/types/faq";

type FaqSectionProps = {
  category: FaqCategory;
};

export function FaqSection({ category }: FaqSectionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(
    category.items[0]?.id ?? null,
  );
  const headingId = `faq-${category.id}-heading`;
  const itemIdPrefix = `faq-${category.id}`;

  return (
    <section aria-labelledby={headingId} className="min-w-0">
      <h2
        className="w-full text-start font-heading text-[30px] font-bold leading-[1.35] text-auth-ink sm:text-[40px]"
        id={headingId}
      >
        {category.title}
      </h2>

      <div className="mt-4 space-y-3.5 sm:mt-7">
        {category.items.map((item) => (
          <FaqAccordionItem
            idPrefix={itemIdPrefix}
            isOpen={openItemId === item.id}
            item={item}
            key={item.id}
            onToggle={() =>
              setOpenItemId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
