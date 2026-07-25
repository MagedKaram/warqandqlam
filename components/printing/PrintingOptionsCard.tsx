"use client";

import type {
  BindingType,
  PaperSize,
  PaperType,
  PrintMode,
  PrintingOptions,
} from "@/types/printing";
import { PRINTING_PRICING } from "@/components/printing/printing-config";

type PrintingOptionsCardProps = {
  options: PrintingOptions;
  onChange: (options: PrintingOptions) => void;
};

const paperSizes = Object.entries(PRINTING_PRICING.paperSizes) as Array<
  [PaperSize, (typeof PRINTING_PRICING.paperSizes)[PaperSize]]
>;
const printModes = Object.entries(PRINTING_PRICING.printModes) as Array<
  [PrintMode, (typeof PRINTING_PRICING.printModes)[PrintMode]]
>;
const paperTypes = Object.entries(PRINTING_PRICING.paperTypes) as Array<
  [PaperType, (typeof PRINTING_PRICING.paperTypes)[PaperType]]
>;
const bindings = Object.entries(PRINTING_PRICING.bindings) as Array<
  [BindingType, (typeof PRINTING_PRICING.bindings)[BindingType]]
>;

export function PrintingOptionsCard({ options, onChange }: PrintingOptionsCardProps) {
  function update<Key extends keyof PrintingOptions>(
    key: Key,
    value: PrintingOptions[Key],
  ) {
    onChange({ ...options, [key]: value });
  }

  function updateCopies(value: number) {
    const safeCopies = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
    update("copies", safeCopies);
  }

  return (
    <section className="w-full min-w-0 rounded-[16px] border border-[#DFE2E5] bg-white p-4 shadow-sm md:p-6">
      <h2 className="w-full text-start font-heading text-[24px] font-bold leading-[1.3] text-auth-ink">
        مواصفات الطباعة
      </h2>

      <div className="mt-8 grid min-w-0 gap-x-10 gap-y-8 lg:grid-cols-2">
        <div className="w-full min-w-0">
          <label className="block w-full text-start font-body text-[16px] font-semibold text-auth-ink" htmlFor="print-copies">
            عدد النسخ
          </label>
          <div className="mt-4 flex h-12 items-center rounded-md border border-auth-border bg-white transition focus-within:border-auth-accent">
            <div className="grid h-full w-11 border-e border-auth-border">
              <button
                aria-label="زيادة عدد النسخ"
                className="flex items-center justify-center text-auth-ink hover:bg-cool-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
                onClick={() => updateCopies(options.copies + 1)}
                type="button"
              >
                ▲
              </button>
              <button
                aria-label="تقليل عدد النسخ"
                className="flex items-center justify-center text-auth-ink hover:bg-cool-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
                onClick={() => updateCopies(options.copies - 1)}
                type="button"
              >
                ▼
              </button>
            </div>
            <input
              className="h-full min-w-0 flex-1 rounded-md px-4 text-end text-[18px] font-semibold text-auth-ink outline-none"
              dir="ltr"
              id="print-copies"
              inputMode="numeric"
              min={1}
              onBlur={() => updateCopies(options.copies)}
              onChange={(event) => updateCopies(Number(event.target.value))}
              type="number"
              value={options.copies}
            />
          </div>
        </div>

        <fieldset className="w-full min-w-0">
          <legend className="w-full text-start font-body text-[16px] font-semibold text-auth-ink">
            مقاس الورق
          </legend>
          <div className="mt-4 flex flex-wrap justify-start gap-4">
            {paperSizes.map(([value, config]) => {
              const selected = options.paperSize === value;

              return (
                <button
                  aria-pressed={selected}
                  className={`flex h-12 min-w-12 items-center justify-center rounded-md border px-4 text-[20px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 ${
                    selected
                      ? "border-auth-accent text-auth-ink"
                      : "border-auth-border text-auth-ink hover:border-auth-accent"
                  }`}
                  key={value}
                  onClick={() => update("paperSize", value)}
                  type="button"
                >
                  {config.label}
                  <span className="sr-only">
                    {selected ? "، محدد" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="lg:col-span-2">
          <legend className="w-full text-start font-body text-[16px] font-semibold text-auth-ink">
            نمط الطباعة
          </legend>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {printModes.map(([value, config]) => {
              const selected = options.printMode === value;

              return (
                <button
                  aria-pressed={selected}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-md border px-4 py-3 text-start text-[16px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 ${
                    selected
                      ? "border-auth-accent text-auth-ink"
                      : "border-auth-border text-auth-ink hover:border-auth-accent"
                  }`}
                  key={value}
                  onClick={() => update("printMode", value)}
                  type="button"
                >
                  <span className={`h-5 w-5 shrink-0 rounded-full border-2 ${selected ? "border-auth-accent bg-auth-accent ring-4 ring-auth-accent/10" : "border-auth-border"}`} />
                  <span className="min-w-0">
                    {config.label}
                    <span className="me-4 text-auth-ink">
                      {config.pricePerPage} / صفحة
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label className="block w-full text-start font-body text-[16px] font-semibold text-auth-ink" htmlFor="binding">
            التجليد
          </label>
          <select
            className="mt-4 h-12 w-full max-w-full rounded-md border border-auth-border bg-white px-4 text-start text-[16px] font-semibold text-auth-ink outline-none transition focus:border-auth-accent focus:ring-2 focus:ring-auth-accent/20"
            id="binding"
            onChange={(event) => update("binding", event.target.value as BindingType)}
            value={options.binding}
          >
            {bindings.map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block w-full text-start font-body text-[16px] font-semibold text-auth-ink" htmlFor="paper-type">
            نوع الورق
          </label>
          <select
            className="mt-4 h-12 w-full max-w-full rounded-md border border-auth-border bg-white px-4 text-start text-[16px] font-semibold text-auth-ink outline-none transition focus:border-auth-accent focus:ring-2 focus:ring-auth-accent/20"
            id="paper-type"
            onChange={(event) => update("paperType", event.target.value as PaperType)}
            value={options.paperType}
          >
            {paperTypes.map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
