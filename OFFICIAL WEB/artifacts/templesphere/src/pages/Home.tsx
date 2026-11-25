import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Features } from "@/components/sections/Features";
import { Solutions } from "@/components/sections/Solutions";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ModuleShowcase } from "@/components/sections/ModuleShowcase";
import { MobileAppShowcase } from "@/components/sections/MobileAppShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { BottomCTA } from "@/components/sections/BottomCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Features />
        <Solutions />
        <HowItWorks />
        <ModuleShowcase />
        <MobileAppShowcase />
        <Testimonials />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
