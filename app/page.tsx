import type { Metadata } from "next";
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveEditorDemo } from '@/components/landing/InteractiveEditorDemo';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CurriculumProgression } from '@/components/landing/CurriculumProgression';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';
import { GoogleAuthInfoSection } from '@/components/landing/GoogleAuthInfoSection';
import { LandingClientWrapper } from '@/components/landing/LandingClientWrapper';

export const metadata: Metadata = {
  title: "LogicPup",
  description: "LogicPup is an educational platform that teaches Python programming through an interactive, visual interface.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LogicPup",
    operatingSystem: "Web",
    applicationCategory: "EducationalApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "The leash-free visual Python programming environment.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingClientWrapper>
        <Header />
        <main className="flex-1">
          <HeroSection />
          <InteractiveEditorDemo />
          <HowItWorksSection />
          <FeaturesSection />
          <CurriculumProgression />
          <GoogleAuthInfoSection />
          <CtaSection />
        </main>
        <Footer />
      </LandingClientWrapper>
    </>
  );
}
