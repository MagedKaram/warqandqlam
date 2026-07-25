import type { FaqItem } from "@/types/faq";

type FaqAccordionItemProps = {
  idPrefix: string;
  isOpen: boolean;
  item: FaqItem;
  onToggle: () => void;
};

const numericRangePattern = /^(?:\d+)(?:-\d+)+$/;

function renderAnswer(answer: string) {
  return answer.split(/((?:\d+)(?:-\d+)+)/g).map((part, index) =>
    numericRangePattern.test(part) ? (
      <bdi className="whitespace-nowrap" dir="ltr" key={`${part}-${index}`}>
        {part}
      </bdi>
    ) : (
      part
    ),
  );
}

export function FaqAccordionItem({
  idPrefix,
  isOpen,
  item,
  onToggle,
}: FaqAccordionItemProps) {
  const triggerId = `${idPrefix}-${item.id}-trigger`;
  const panelId = `${idPrefix}-${item.id}-panel`;

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-[16px] border bg-white ${
        isOpen ? "border-auth-accent" : "border-auth-border/80"
      }`}
      data-faq-item={item.id}
    >
      <h3>
        <button
          aria-controls={panelId}
          aria-expanded={isOpen}
          className={`flex w-full min-w-0 items-center justify-between gap-4 px-5 text-start font-body text-[17px] font-bold leading-7 text-auth-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-auth-accent sm:gap-6 sm:px-9 sm:text-xl sm:leading-8 ${
            isOpen
              ? "pt-4 pb-1 sm:pt-6 sm:pb-2"
              : "min-h-[64px] py-4 sm:min-h-[76px] sm:py-5"
          }`}
          id={triggerId}
          onClick={onToggle}
          type="button"
        >
          <span className="min-w-0 text-start">{item.question}</span>
          <span
            aria-hidden="true"
            className={`shrink-0 text-2xl font-normal leading-none sm:text-[28px] ${
              isOpen ? "text-auth-accent" : "text-auth-ink"
            }`}
          >
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </h3>

      <div
        aria-labelledby={triggerId}
        hidden={!isOpen}
        id={panelId}
        role="region"
      >
        <p className="px-5 pt-1 pb-4 text-start font-body text-base font-semibold leading-7 text-auth-ink sm:px-9 sm:pb-6 sm:text-xl sm:leading-8">
          {renderAnswer(item.answer)}
        </p>
      </div>
    </article>
  );
}
