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
  title: "LogicPup — Visual Python Flowchart IDE",
  description: "Learn Python programming through an interactive, drag-and-drop flowchart interface. LogicPup eliminates syntax errors so beginners can focus on building logic and real coding skills.",
  alternates: {
    canonical: "https://logicpup.heymahesh.in/",
  },
  openGraph: {
    title: "LogicPup — Visual Python Flowchart IDE",
    description: "Learn Python programming through an interactive, drag-and-drop flowchart interface. LogicPup eliminates syntax errors so beginners can focus on building logic and real coding skills.",
    siteName: "LogicPup",
    url: "https://logicpup.heymahesh.in/",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogicPup — Visual Python Flowchart IDE",
    description: "Learn Python programming through an interactive, drag-and-drop flowchart interface.",
  },
};

export default function Page() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "LogicPup",
      url: "https://logicpup.heymahesh.in/",
      operatingSystem: "Web",
      applicationCategory: "EducationalApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: "The leash-free visual Python programming environment.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "LogicPup",
      url: "https://logicpup.heymahesh.in/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://logicpup.heymahesh.in/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

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
