"use client";

import type { CountryCode } from "libphonenumber-js";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input/input";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import arLabels from "react-phone-number-input/locale/ar.json";

type PhoneFieldProps = {
  value: string;
  country: CountryCode;
  error?: string;
  onCountryChange: (value: CountryCode) => void;
  onValueChange: (value: string) => void;
};

export function PhoneField({
  value,
  country,
  error,
  onCountryChange,
  onValueChange,
}: PhoneFieldProps) {
  const id = useId();
  const dropdownId = `${id}-countries`;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const countries = useMemo(
    () =>
      getCountries().map((code) => {
        const countryCode = code as CountryCode;
        const name = arLabels[code as keyof typeof arLabels] ?? code;
        const callingCode = getCountryCallingCode(code);

        return {
          code: countryCode,
          name,
          callingCode,
        };
      }),
    [],
  );

  const selectedCountry =
    countries.find((item) => item.code === country) ?? countries[0];
  const SelectedFlag = flags[selectedCountry.code];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredCountries = normalizedSearch
    ? countries.filter((item) => {
        const haystack =
          `${item.name} ${item.code} ${item.callingCode}`.toLowerCase();
        return haystack.includes(normalizedSearch);
      })
    : countries;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="space-y-2">
      <label className="block text-start text-xl font-semibold text-auth-ink" htmlFor={id}>
        رقم الهاتف
      </label>

      <div className="relative" ref={dropdownRef}>
        <div className="flex h-auth-field items-center rounded-md border border-auth-border bg-white focus-within:border-auth-link focus-within:ring-2 focus-within:ring-auth-link/20">
          <button
            aria-controls={dropdownId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label="اختيار الدولة"
            className="flex h-full w-36 items-center justify-center gap-2 rounded-s-md border-e border-auth-border px-2 text-sm font-semibold text-auth-ink outline-none sm:w-44 sm:text-base"
            onClick={() => {
              setOpen((current) => !current);
              setSearch("");
            }}
            type="button"
          >
            <span className="h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-auth-cream">
              {SelectedFlag ? <SelectedFlag title={selectedCountry.name} /> : null}
            </span>
            <span className="truncate">
              {selectedCountry.name} +{selectedCountry.callingCode}
            </span>
          </button>

          <PhoneInput
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={Boolean(error)}
            className="h-full min-w-0 flex-1 rounded-e-md px-3 text-lg text-auth-ink outline-none placeholder:text-auth-muted sm:px-4 sm:text-xl"
            country={country}
            dir="ltr"
            id={id}
            international={false}
            onChange={(nextValue) => onValueChange(nextValue ?? "")}
            placeholder="ادخل رقمك"
            value={value}
          />
        </div>

        {open ? (
          <div
            className="absolute start-0 top-[calc(100%+0.5rem)] z-50 w-full rounded-md border border-auth-border bg-white p-3 shadow-xl"
            id={dropdownId}
          >
            <input
              aria-label="بحث الدولة"
              className="h-12 w-full rounded-md border border-auth-border px-4 text-start text-base text-auth-ink outline-none placeholder:text-auth-muted focus:border-auth-link focus:ring-2 focus:ring-auth-link/20"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث باسم الدولة أو الرمز"
              value={search}
            />

            <div className="mt-3 max-h-72 overflow-y-auto" role="listbox">
              {filteredCountries.map((item) => {
                const Flag = flags[item.code];

                return (
                  <button
                    aria-selected={item.code === country}
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-start text-base font-semibold text-auth-ink hover:bg-auth-cream focus-visible:bg-auth-cream focus-visible:outline-none"
                    key={item.code}
                    onClick={() => {
                      onCountryChange(item.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    role="option"
                    type="button"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-auth-cream">
                        {Flag ? <Flag title={item.name} /> : null}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="shrink-0 text-sm text-auth-muted" dir="ltr">
                      +{item.callingCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-start text-sm font-medium text-auth-accent" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
