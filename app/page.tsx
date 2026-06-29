import { Categories } from "@/components/home/Categories";
// import { Features } from "@/components/home/Features";
import { HeroSlider } from "@/components/home/HeroSlider";
import { PrintServices } from "@/components/home/PrintServices";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSlider />
      {/* <Features /> */}
      <PrintServices />
      <Categories />
    </main>
  );
}
