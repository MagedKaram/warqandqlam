type Feature = {
  title: string;
  subtitle: string;
};

const features: Feature[] = [
  {
    title: "شحن سريع",
    subtitle: "توصيل في غضون 48 ساعة",
  },
  {
    title: "ضمان الجودة",
    subtitle: "منتجات أصلية 100%",
  },
  {
    title: "دعم 24/7",
    subtitle: "خدمة عملاء متميزة",
  },
  {
    title: "طباعة احترافية",
    subtitle: "خدمة طباعة عالية الجودة",
  },
];

function FeatureItem({ title, subtitle }: Feature) {
  return (
    <article className="flex h-full flex-col items-center text-center">
      <h2 className="flex min-h-20 items-center justify-center text-3xl font-bold leading-tight text-auth-ink md:min-h-12 md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-lg font-semibold leading-7 text-auth-muted md:mt-5 md:text-xl">
        {subtitle}
      </p>
    </article>
  );
}

export function Features() {
  return (
    <section className="bg-white px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:gap-10">
        {features.map((feature) => (
          <FeatureItem key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
