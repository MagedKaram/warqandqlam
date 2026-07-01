import Image from "next/image";
import { companyLogos } from "@/lib/mock-data";

export function CompanyLogos() {
  return (
    <section className="bg-white">
      <div className="px-6 pb-10 pt-16 text-center md:px-10">
        <h2 className="text-4xl font-bold text-auth-ink md:text-5xl">
          شركاؤنا المميزون
        </h2>
        <p className="mt-5 text-lg font-semibold text-auth-ink">
          علامات تجارية نثق بها لتقديم الأفضل لك
        </p>
      </div>

      <div className="bg-cool-200 px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-10 gap-y-8 md:grid-cols-4">
          {companyLogos.map((company) => (
            <div className="flex justify-center" key={company.id}>
              <Image
                alt={company.name}
                className="h-auto w-auto max-h-16 object-contain"
                height={48}
                src={company.image}
                width={190}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
