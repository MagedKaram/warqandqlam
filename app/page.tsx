import { Categories } from "@/components/home/Categories";
import { BestSellers } from "@/components/home/BestSellers";
import { CompanyLogos } from "@/components/home/CompanyLogos";
import { Faq } from "@/components/home/Faq";
// import { Features } from "@/components/home/Features";
import { HeroSlider } from "@/components/home/HeroSlider";
import { PrintServices } from "@/components/home/PrintServices";
import { SchoolPromo } from "@/components/home/SchoolPromo";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSlider />
      {/* <Features /> */}
      <PrintServices />
      <Categories />
      <BestSellers />
      <SchoolPromo />
      <Testimonials />
      <CompanyLogos />
      <Faq />
    </main>
  );
}
