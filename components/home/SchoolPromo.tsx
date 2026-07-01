import Image from "next/image";
import { PiArrowLeft } from "react-icons/pi";
import { SectionButton } from "@/components/home/SectionButton";

type SchoolPromoProps = {
  headingLevel?: "h1" | "h2";
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  priority?: boolean;
};

export function SchoolPromo({
  headingLevel = "h2",
  ctaHref = "/products",
  imageSrc = "/assets/images/home/6a7ad6a2ea33ce7fba7e26439160aebd852cc90b.png",
  imageAlt = "مستلزمات مدرسية وحقائب وأقلام",
  imageWidth,
  imageHeight,
  priority = false,
}: SchoolPromoProps) {
  const Heading = headingLevel;

  return (
    <section className="bg-home-promo px-6 py-8 md:px-10 lg:py-9">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="order-1 text-center lg:text-right">
          <span className="inline-flex rounded-md bg-auth-ink px-4 py-2 text-sm font-bold text-white md:text-base">
            خصم يصل إلى 40%
          </span>
          <Heading className="mt-5 font-heading text-5xl font-bold leading-tight text-auth-ink md:text-6xl">
            تجهيزات المدارس
          </Heading>
          <p className="mt-4 font-body text-xl font-bold leading-8 text-auth-ink md:text-2xl md:leading-10">
            على كل المستلزمات المدرسية والأقلام
          </p>
          <div className="mt-6">
            <SectionButton href={ctaHref} icon={<PiArrowLeft className="text-xl" />}>
              تسوق العروض
            </SectionButton>
          </div>
        </div>

        <div className="relative order-2 flex min-h-80 items-center justify-center lg:min-h-[360px]">
          {imageWidth && imageHeight ? (
            <Image
              alt={imageAlt}
              className="h-auto w-[20rem] max-w-full object-contain md:w-[24rem]"
              height={imageHeight}
              priority={priority}
              src={imageSrc}
              width={imageWidth}
            />
          ) : (
            <>
              <Image
                alt={imageAlt}
                className="object-contain"
                fill
                priority={priority}
                sizes="(min-width: 1024px) 45vw, 90vw"
                src={imageSrc}
              />
              <div className="absolute left-4 top-0 flex h-28 w-28 -rotate-[18deg] items-center justify-center rounded-full border-8 border-white bg-home-promo-badge text-2xl font-bold text-auth-ink shadow-sm md:left-8 md:h-36 md:w-36 md:text-3xl">
                40%
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
