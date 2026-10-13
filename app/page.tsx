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
  title: "LogicPup — Visual Python Flowchart IDE & Learning Playground",
  description:
    "Master Python programming visually. Drag and drop flowchart blocks, compile to real Python 3 code in real-time, and learn programming logic without syntax errors. Free interactive visual Python IDE.",
  keywords: [
    "visual python editor",
    "python flowchart programming",
    "flowchart to python code",
    "visual python ide",
    "learn python visually",
    "python block coding",
    "drag and drop python",
    "flowchart to code generator",
    "blockly python",
    "scratch to python",
    "interactive python playground",
    "learn python for beginners",
    "python visualizer",
    "python AST compiler",
    "python flowchart maker",
    "visual logic programming",
    "online python editor",
    "python for students",
    "python flowchart simulator",
    "no syntax error coding",
    "logic pup",
    "LogicPup",
  ],
  alternates: {
    canonical: "https://logicpup.heymahesh.in/",
  },
  applicationName: "LogicPup",
  appleWebApp: {
    title: "LogicPup",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    title: "LogicPup — Visual Python Flowchart IDE & Learning Playground",
    description:
      "Master Python programming visually. Drag and drop flowchart blocks, compile to real Python 3 code in real-time, and learn programming logic without syntax errors.",
    siteName: "LogicPup",
    url: "https://logicpup.heymahesh.in/",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "LogicPup — Visual Python Flowchart IDE & Learning Playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LogicPup — Visual Python Flowchart IDE & Learning Playground",
    description:
      "Drag-and-drop flowchart blocks, fetch real Python 3 code, and master programming logic without syntax errors. Free visual Python IDE.",
    creator: "@logicpup",
    images: ["/logo.png"],
  },
};

export default function Page() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "LogicPup",
      alternateName: ["LogicPup IDE", "Logic Pup", "LogicPup Visual Python IDE"],
      url: "https://logicpup.heymahesh.in/",
      operatingSystem: "All, Web Browser, Windows, macOS, Linux, ChromeOS, iOS, Android",
      applicationCategory: "DeveloperApplication, EducationalApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Visual Python Flowchart IDE and interactive coding playground. Build logic with drag-and-drop flowchart blocks and generate real, clean Python 3 code in real time.",
      featureList: [
        "Visual drag-and-drop flowchart programming",
        "Real-time Python 3 AST code generation",
        "Syntax-free logic learning for beginners",
        "In-browser interactive execution and debugging",
        "Curriculum levels from basics to loops and functions",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "128",
        bestRating: "5",
        worstRating: "1",
      },
      screenshot: "https://logicpup.heymahesh.in/logo.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://logicpup.heymahesh.in/#website",
      name: "LogicPup",
      alternateName: [
        "LogicPup IDE",
        "Logic Pup",
        "logicpup.heymahesh.in",
        "LogicPup Visual Python IDE",
      ],
      url: "https://logicpup.heymahesh.in/",
      description: "Visual Python Flowchart IDE & Learning Playground.",
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is LogicPup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LogicPup is a free visual Python flowchart IDE and learning playground that lets you build computer programs by connecting logic blocks. It converts visual flowcharts into real, clean Python 3 code in real time.",
          },
        },
        {
          "@type": "Question",
          name: "How does visual flowchart programming help learn Python?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "By using drag-and-drop visual nodes, beginners understand programmatic thinking, branching conditions, loops, and variables without getting frustrated by syntax errors like missing colons or indentation issues.",
          },
        },
        {
          "@type": "Question",
          name: "Does LogicPup generate real Python code?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, LogicPup uses an internal AST engine that automatically translates your visual flowchart blocks into production-ready, readable Python 3 code in real time.",
          },
        },
        {
          "@type": "Question",
          name: "Is LogicPup free to use for beginners and students?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, LogicPup is completely free to use in any modern web browser without requiring any local installations or configurations.",
          },
        },
      ],
    },
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
