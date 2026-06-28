import { featuredProducts } from "@/lib/mock-data";
import { HeroSlider } from "@/components/home/HeroSlider";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSlider />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 md:px-10">
        <header className="flex items-center justify-between border-b border-neutral-400 pb-6">
          <div>
            <p className="text-sm text-neutral-1000">قرطاسية وكتب</p>
            <h1 className="text-4xl font-semibold text-neutral-1300">ورقة وقلم</h1>
          </div>
          <button className="rounded-md bg-brand-900 px-5 py-3 text-sm font-semibold text-white">
            تصفح المنتجات
          </button>
        </header>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg bg-cool-200 p-8">
            <p className="mb-4 text-sm font-semibold text-brand-1000">
              واجهة أولية ببيانات تجريبية
            </p>
            <h2 className="max-w-2xl text-5xl font-semibold leading-[1.35] text-neutral-1300">
              كل ما يحتاجه الطلاب والقراء والمكاتب في مكان واحد
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-1000">
              هذه شاشة بداية للواجهة فقط، مبنية لتتصل لاحقا بواجهة برمجة التطبيقات
              عند جاهزية الباك اند.
            </p>
          </div>

          <div className="grid gap-4">
            {featuredProducts.map((product) => (
              <article
                className="rounded-lg border border-neutral-400 bg-white p-5"
                key={product.id}
              >
                <p className="text-sm text-brand-900">{product.category}</p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-1300">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm text-neutral-1000">{product.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      </main>
  );
}
