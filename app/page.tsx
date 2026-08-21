import type { Metadata } from "next";
import ClientPage from "./page.client";

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
      <ClientPage />
      
      {/* Google OAuth Verification Section */}
      <div className="bg-[#F4F1EA] text-[#171717] py-16 border-t border-[#E5E2DA]">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <section>
            <h1 className="text-4xl font-bold mb-6 uppercase tracking-tight">LogicPup</h1>
            <div className="space-y-4 text-base text-[#444] leading-relaxed">
              <p>
                <strong>What it is:</strong> LogicPup is an educational platform that teaches Python programming through an interactive, visual interface.
              </p>
              <p>
                <strong>What it does:</strong> It guides users through structured coding levels, letting them learn concepts, practice with visual blocks, and complete challenges to master their coding skills.
              </p>
              <p>
                <strong>Who it's for:</strong> Built for beginners learning to code — especially those intimidated by traditional text-based programming. Because it uses visual blocks (similar to Scratch) but focuses specifically on Python, it's ideal for middle and high school students (13+), educators looking for an interactive teaching tool, and adults who want a guided, gamified path into programming without battling syntax errors right away.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 uppercase text-[#171717]">How it works</h2>
            <p className="text-base text-[#444] leading-relaxed">
              Users progress through structured coding levels. At each level they learn a Python concept, practice it using drag-and-drop visual blocks (instead of typing raw syntax), and complete challenges/gamified exercises to demonstrate mastery before advancing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 uppercase text-[#171717]">Why we use Google</h2>
            <p className="mb-4 text-base text-[#444] leading-relaxed">
              We use Google Sign-In so you can create an account and save your progress across coding levels without creating a separate password.
            </p>
            <p className="mb-3 text-sm font-bold text-[#555] uppercase tracking-wide">Scopes requested:</p>
            <ul className="list-disc pl-6 space-y-2 text-base text-[#444]">
              <li><strong>openid, email, profile</strong> — to identify you and create your LogicPup account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 uppercase text-[#171717]">Privacy</h2>
            <p className="text-base text-[#444]">
              For more information on how we handle your data, please read our{" "}
              <a href="/privacy" className="text-[#F26A3D] font-bold hover:underline">Privacy Policy</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
