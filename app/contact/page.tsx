import type { Metadata } from "next";
import Link from "next/link";
import { PiEnvelopeSimple, PiMapPin, PiPhone } from "react-icons/pi";

export const metadata: Metadata = {
  title: "تواصل معنا | ورقة وقلم",
  description: "بيانات التواصل في نموذج واجهة ورقة وقلم.",
};

const contactItems = [
  { label: "الهاتف", value: "0100 000 0000", icon: PiPhone },
  { label: "البريد الإلكتروني", value: "hello@warqandqlam.example", icon: PiEnvelopeSimple },
  { label: "العنوان", value: "القاهرة، مصر", icon: PiMapPin },
];

export default function ContactPage() {
  return (
    <main className="bg-white px-6 py-20 text-foreground md:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex rounded-md bg-home-promo px-4 py-2 text-sm font-bold text-auth-accent">
            نموذج أولي
          </span>
          <h1 className="mt-6 font-heading text-5xl font-bold leading-tight text-auth-ink md:text-6xl">
            تواصل معنا
          </h1>
          <p className="mx-auto mt-5 max-w-3xl font-body text-xl font-semibold leading-10 text-auth-muted">
            بيانات التواصل الحالية مخصصة للنموذج الأولي فقط حتى يتم اعتماد بيانات الفروع
            وخدمة العملاء النهائية.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {contactItems.map(({ icon: Icon, label, value }) => (
            <article
              className="rounded-lg border border-auth-border/60 bg-white px-6 py-8 text-center"
              key={label}
            >
              <Icon aria-hidden className="mx-auto text-5xl text-auth-accent" />
              <h2 className="mt-5 font-heading text-3xl font-bold text-auth-ink">
                {label}
              </h2>
              <p className="mt-3 font-body text-lg font-bold text-auth-muted" dir="ltr">
                {value}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md bg-auth-accent px-6 text-base font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
            href="/products"
            prefetch={false}
          >
            العودة للتسوق
          </Link>
        </div>
      </section>
    </main>
  );
}
