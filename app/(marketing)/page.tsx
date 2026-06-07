import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Navbar } from '@/components/marketing/navbar';
import { HeroSection } from '@/components/marketing/hero-section';
import { FeaturesSection } from '@/components/marketing/features-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { TestimonialsSection } from '@/components/marketing/testimonials-section';
import { FAQSection } from '@/components/marketing/faq-section';
import { FooterSection } from '@/components/marketing/footer-section';
import { CTASection } from '@/components/marketing/cta-section';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
