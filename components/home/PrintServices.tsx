import Image from "next/image";
import { PiPrinter } from "react-icons/pi";
import { SectionButton } from "@/components/home/SectionButton";

type PrintService = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const printServices: PrintService[] = [
  {
    title: "1. ارفع ملفك",
    description:
      "قم برفع ملفات pdf او word مباشرة من جهازك بأمان تام و سهولة متناهية",
    image: "/assets/images/home/Frame 427321653.png",
    alt: "رفع ملف للطباعة",
  },
  {
    title: "2. اختر الاعدادات",
    description:
      "حدد نوع الورق، الالوان، وعدد النسخ وخيارات التغليف الاحترافية بلمسة واحدة",
    image: "/assets/images/home/hero.jpg",
    alt: "اختيار اعدادات الطباعة",
  },
  {
    title: "3. استلم طلبك",
    description:
      "توصيل سريع لباب منزلك او استلام طلبك من اقرب فرع، تتبع طلبك لحظة بلحظة",
    image: "/assets/images/home/74319bbead95c81298ab94642e9aaf991dfcf47e.jpg",
    alt: "استلام طلب الطباعة",
  },
];

function PrintServiceCard({ title, description, image, alt }: PrintService) {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-[0_18px_48px_rgba(11,32,54,0.18)] ring-1 ring-auth-border/30">
      <div className="relative h-56 bg-cool-200 sm:h-64">
        <Image
          alt={alt}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
          src={image}
        />
      </div>
      <div className="px-6 py-7 text-right">
        <h3 className="text-2xl font-bold text-auth-ink">{title}</h3>
        <p className="mt-4 text-base font-semibold leading-7 text-auth-muted">
          {description}
        </p>
      </div>
    </article>
  );
}

export function PrintServices() {
  return (
    <section className="bg-white px-6 pb-20 md:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-bold text-auth-ink md:text-5xl">
          خدمات الطباعة الرقمية
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-auth-muted">
          اطبع مستنداتك بسهولة تامة من خلال ثلاث خطوات بسيطة، مع خيارات متعددة للجودة والتغليف.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {printServices.map((service) => (
            <PrintServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-10">
          <SectionButton href="/printing" icon={<PiPrinter className="text-2xl" />}>
            ابدأ الطباعة الآن
          </SectionButton>
        </div>
      </div>
    </section>
  );
}
