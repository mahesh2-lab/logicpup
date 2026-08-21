import type { Metadata } from "next";
import ClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Visual Python Flowchart IDE & Learning Playground",
  description: "The leash-free visual Python programming environment where logic meets fun. Connect flowchart blocks, fetch real Python 3 code, and chase zero bugs.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LogicPup",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "The leash-free visual Python programming environment."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientPage />
    </>
  );
}

