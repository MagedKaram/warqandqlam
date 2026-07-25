"use client";

import type {
  DeliveryInformation,
  DeliveryInformationErrors,
} from "@/types/checkout";

type DeliveryFormProps = {
  delivery: DeliveryInformation;
  errors: DeliveryInformationErrors;
  onChange: <Field extends keyof DeliveryInformation>(
    field: Field,
    value: DeliveryInformation[Field],
  ) => void;
};

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "email" | "tel";
  dir?: "ltr";
  onChange: (value: string) => void;
};

function CheckoutTextField({
  dir,
  error,
  id,
  label,
  onChange,
  placeholder,
  required = false,
  type = "text",
  value,
}: TextFieldProps) {
  return (
    <div className="min-w-0">
      <label
        className="block w-full text-start text-base font-bold text-auth-ink"
        htmlFor={id}
      >
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </label>
      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        className={`mt-2 h-[50px] w-full min-w-0 max-w-full rounded-md border bg-white px-4 text-base font-semibold text-auth-ink outline-none transition placeholder:text-auth-muted focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-auth-border focus:border-auth-link focus:ring-auth-link/20"
        }`}
        dir={dir}
        id={id}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {error ? (
        <p
          className="mt-2 text-start text-sm font-semibold text-red-600"
          id={`${id}-error`}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function DeliveryForm({
  delivery,
  errors,
  onChange,
}: DeliveryFormProps) {
  return (
    <section className="min-w-0" aria-labelledby="delivery-information-title">
      <h1
        className="w-full text-start font-heading text-4xl font-bold text-auth-ink sm:text-5xl"
        id="delivery-information-title"
      >
        معلومات التوصيل
      </h1>

      <div className="mt-7 grid min-w-0 gap-x-6 gap-y-5 sm:grid-cols-2">
        <CheckoutTextField
          error={errors.fullName}
          id="fullName"
          label="الاسم الكامل"
          onChange={(value) => onChange("fullName", value)}
          placeholder="أدخل اسمك الكامل"
          required
          value={delivery.fullName}
        />
        <CheckoutTextField
          dir="ltr"
          error={errors.phone}
          id="phone"
          label="رقم الهاتف"
          onChange={(value) => onChange("phone", value)}
          placeholder="01*********"
          required
          type="tel"
          value={delivery.phone}
        />

        <div className="min-w-0 sm:col-span-2">
          <CheckoutTextField
            dir="ltr"
            error={errors.email}
            id="email"
            label="البريد الإلكتروني"
            onChange={(value) => onChange("email", value)}
            placeholder="example@gmail.com"
            required
            type="email"
            value={delivery.email}
          />
        </div>

        <div className="min-w-0 sm:col-span-2">
          <CheckoutTextField
            error={errors.address}
            id="address"
            label="العنوان"
            onChange={(value) => onChange("address", value)}
            placeholder="الشارع، المنطقة، رقم المبنى"
            required
            value={delivery.address}
          />
        </div>

        <div className="min-w-0 sm:col-span-2">
          <CheckoutTextField
            error={errors.city}
            id="city"
            label="المدينة / المحافظة"
            onChange={(value) => onChange("city", value)}
            placeholder="القاهرة، الإسكندرية"
            required
            value={delivery.city}
          />
        </div>

        <div className="min-w-0 sm:col-span-2">
          <label
            className="block w-full text-start text-base font-bold text-auth-ink"
            htmlFor="notes"
          >
            ملاحظات إضافية
          </label>
          <textarea
            className="mt-2 h-[50px] min-h-[50px] w-full min-w-0 max-w-full resize-y rounded-md border border-auth-border bg-white px-4 py-2 text-base font-semibold leading-7 text-auth-ink outline-none transition placeholder:text-auth-muted focus:border-auth-link focus:ring-2 focus:ring-auth-link/20"
            id="notes"
            name="notes"
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="أي ملاحظات خاصة بالطلب..."
            value={delivery.notes}
          />
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-3 text-start text-base font-bold text-auth-ink">
        <input
          checked={delivery.saveForLater}
          className="h-5 w-5 shrink-0 rounded border-auth-border accent-auth-accent"
          name="saveForLater"
          onChange={(event) => onChange("saveForLater", event.target.checked)}
          type="checkbox"
        />
        <span className="min-w-0">حفظ هذه المعلومات للمرة القادمة</span>
      </label>
    </section>
  );
}
