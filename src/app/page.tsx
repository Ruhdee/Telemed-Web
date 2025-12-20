import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { TopDoctors } from "@/components/landing/TopDoctors";
import { HowItWorks } from "@/components/landing/HowItWorks";

import { Testimonials } from "@/components/landing/Testimonials";
import { Stats } from "@/components/landing/Stats";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-[var(--gold-light)] selection:text-[var(--text-primary)]">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <TopDoctors />
      <Testimonials />
      <HowItWorks />
      <Footer />
    </main>
  );
}
