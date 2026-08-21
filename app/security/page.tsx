import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Security",
  description: "LogicPup Security Information",
  alternates: {
    canonical: "/security",
  },
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F1EA] text-[#171717]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-6">Security</h1>
        <p className="mb-4">
          [FIXME: This is a placeholder for the actual Security information. Please provide content/product input to fill this out.]
        </p>
      </main>
      <Footer />
    </div>
  );
}
