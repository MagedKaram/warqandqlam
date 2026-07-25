import Link from "next/link";
import {
  PiArrowLeft,
  PiCheckBold,
  PiPackage,
  PiXBold,
} from "react-icons/pi";

type OrderResultStatus = "success" | "failure";

type OrderResultViewProps = {
  status: OrderResultStatus;
};

const resultContent = {
  success: {
    bannerClassName: "bg-[#c8e6c9]",
    bannerTitle: "تم تأكيد طلبك بنجاح",
    bannerDescription: "شكرًا لطلبك من ورقة وقلم",
    title: "شكرًا لاختيارك ورقة وقلم",
    description:
      "تم استلام طلبك بنجاح، ونعمل الآن على معالجته وتجهيزه للشحن.",
    actionLabel: "متابعة التسوق",
    actionHref: "/products",
    StatusIcon: PiCheckBold,
    statusIconClassName: "text-[#61a36b]",
  },
  failure: {
    bannerClassName: "bg-[#fbc0c0]",
    bannerTitle: "فشل الطلب",
    bannerDescription: "نعتذر، حدثت مشكلة أدت إلى فشل إتمام الطلب.",
    title: "حدث خطأ ما",
    description:
      "حدثت مشكلة أثناء معالجة طلبك. يرجى مراجعة البيانات والمحاولة مرة أخرى.",
    actionLabel: "إعادة الطلب",
    actionHref: "/checkout",
    StatusIcon: PiXBold,
    statusIconClassName: "text-[#ee755d]",
  },
} as const;

export function OrderResultView({ status }: OrderResultViewProps) {
  const content = resultContent[status];
  const StatusIcon = content.StatusIcon;
  const resultTitleId = `order-${status}-title`;

  return (
    <main className="min-w-0 flex-1 bg-white text-auth-ink">
      <section
        aria-labelledby={`${resultTitleId}-banner`}
        className={`flex min-h-40 w-full items-center ${content.bannerClassName}`}
      >
        <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 md:py-9 xl:px-0">
          <h1
            className="w-full text-start font-heading text-4xl font-bold leading-tight sm:text-[42px]"
            id={`${resultTitleId}-banner`}
          >
            {content.bannerTitle}
          </h1>
          <p className="mt-2 w-full text-start font-body text-base font-semibold leading-7 sm:text-lg">
            {content.bannerDescription}
          </p>
        </div>
      </section>

      <section
        aria-labelledby={resultTitleId}
        className="flex min-h-[620px] w-full items-center justify-center px-4 py-16 sm:px-6 md:min-h-[820px] md:py-20"
      >
        <div className="flex w-full min-w-0 max-w-xl flex-col items-center text-center">
          <div
            aria-hidden
            className="relative flex h-44 w-44 max-w-full items-center justify-center text-auth-ink"
          >
            <PiPackage className="text-[9.5rem]" />
            <span className="absolute bottom-3 right-0 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-auth-ink bg-white">
              <StatusIcon
                className={`text-[2.25rem] ${content.statusIconClassName}`}
              />
            </span>
          </div>

          <h2
            className="mt-8 w-full text-center font-heading text-4xl font-bold leading-tight sm:text-[42px]"
            id={resultTitleId}
          >
            {content.title}
          </h2>
          <p className="mt-5 max-w-lg font-body text-base font-semibold leading-8 text-auth-muted sm:text-lg">
            {content.description}
          </p>

          <div className="mt-7 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-13 min-w-0 flex-1 items-center justify-center gap-3 rounded-md border border-auth-ink px-6 py-3 font-body text-base font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-link focus-visible:ring-offset-2 sm:text-lg"
              href={content.actionHref}
              prefetch={false}
            >
              <span>{content.actionLabel}</span>
              <PiArrowLeft aria-hidden className="shrink-0 text-2xl" />
            </Link>

            {status === "failure" ? (
              <Link
                className="inline-flex min-h-13 min-w-0 flex-1 items-center justify-center rounded-md border border-auth-accent px-6 py-3 font-body text-base font-bold text-auth-accent transition hover:bg-home-promo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 sm:text-lg"
                href="/checkout?changePayment=1"
                prefetch={false}
              >
                تغيير طريقة الدفع
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
