import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "LogicPup Terms of Service",
  alternates: {
    canonical: "https://logicpup.heymahesh.in/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F1EA] text-[#171717]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 uppercase tracking-tight">Terms of Service</h1>
        <p className="text-sm text-[#888] font-mono mb-12">Last Updated: August 21, 2026</p>
        
        <div className="space-y-10 text-base text-[#444] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">1. Acceptance of Terms</h2>
            <p>
              By accessing and using LogicPup ("we", "our", or "us"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using LogicPup's specific services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">2. Description of Service</h2>
            <p>
              LogicPup provides a visual Python learning platform that allows users to create projects, save workspaces, and solve educational challenges (the "Service"). You understand and agree that the Service is provided "AS-IS" and that we assume no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">3. User Conduct and Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be 13 years or older to use this Service.</li>
              <li>You are responsible for maintaining the security of your account and password. LogicPup cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>
              <li>You are responsible for all content posted and activity that occurs under your account.</li>
              <li>You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of LogicPup and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of LogicPup.
            </p>
            <p className="mt-3">
              Any Python code or visual projects you create on LogicPup belong to you. By creating public projects, you grant us a license to display, perform, and distribute your content on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">6. Limitation of Liability</h2>
            <p>
              In no event shall LogicPup, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">7. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at: 
              <br />
              <strong className="text-[#F26A3D]">legal@logicpup.com</strong>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
