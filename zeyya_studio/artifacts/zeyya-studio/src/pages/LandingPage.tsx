import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { WhyUsSection } from '@/components/sections/WhyUsSection';
import { CaseStudiesSection } from '@/components/sections/CaseStudiesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { PromoSection } from '@/components/sections/PromoSection';
import { DomainPricingSection } from '@/components/sections/DomainPricingSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { FounderSection } from '@/components/sections/FounderSection';
import { CTASection } from '@/components/sections/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <LoadingScreen />
      <Navbar />

      {/* Section 1 – Dark */}
      <HeroSection />

      {/* Section 2 – Cream */}
      <AboutSection />

      {/* Section 3 – Dark Gradient (brown-orange) */}
      <WhyUsSection />

      {/* Section 4 – Cream */}
      <ServicesSection />

      {/* Section 5 – Dark (mid) */}
      <CaseStudiesSection />

      {/* Section 6 – Dark */}
      <TestimonialsSection />

      {/* Section 7 – Cream */}
      <ProcessSection />

      {/* Section 8 – Orange Gradient */}
      <PromoSection />

      {/* Section 9 – Cream */}
      <DomainPricingSection />

      {/* Section 10 – Light Grey */}
      <FAQSection />

      {/* Section 11 – Cream */}
      <FounderSection />

      {/* Section 12 – Dark (pre-footer CTA) */}
      <CTASection />

      {/* Footer – #050505 */}
      <Footer />
    </main>
  );
}
