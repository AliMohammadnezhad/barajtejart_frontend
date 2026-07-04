import BlogSection from "@/components/BlogSection";
import CTABanner from "@/components/CTABanner";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <StatsSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
      <CTABanner />
      <ContactSection />
    </>
  );
}
