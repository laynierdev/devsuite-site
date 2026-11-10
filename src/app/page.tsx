import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { Stage } from "@/components/sections/Stage";
import { Preloader } from "@/components/ui/Preloader";
import { RevealObserver } from "@/components/ui/RevealObserver";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="main">
        <Stage />
        <ProductShowcase />
        <PhilosophySection />
        <FinalCTA />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
