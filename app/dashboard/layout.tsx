import React from "react";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/visual-editor/dashboard/DashboardShell";
import { BlockExplanationModal } from "@/components/visual-editor/components/BlockExplanationModal";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dashboard",
        item: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    ],
  };

  return (
    <DashboardShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
      <BlockExplanationModal />
    </DashboardShell>
  );
}
