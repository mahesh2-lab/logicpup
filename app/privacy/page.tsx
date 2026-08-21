import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "LogicPup Privacy Policy",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F1EA] text-[#171717]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 uppercase tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-[#888] font-mono mb-12">Last Updated: August 21, 2026</p>
        
        <div className="space-y-10 text-base text-[#444] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">1. Introduction</h2>
            <p>
              Welcome to LogicPup. We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you visit our website and use our visual Python learning platform. By using LogicPup, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">2. Information We Collect</h2>
            <p className="mb-3">We may collect information about you in a variety of ways, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register for an account.</li>
              <li><strong>Authentication Data:</strong> Information from third-party OAuth providers (like Google or GitHub) if you choose to sign in using their services, including your profile picture and email.</li>
              <li><strong>Usage Data:</strong> Information about your activity on our platform, such as your progress in coding challenges, saved workspaces, and project data.</li>
              <li><strong>Log Data:</strong> Information that your browser sends whenever you visit our platform, such as your computer's Internet Protocol (IP) address, browser type, and diagnostic data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage your account securely.</li>
              <li>Save your learning progress and visual Python projects.</li>
              <li>Improve our educational content, algorithms, and user experience.</li>
              <li>Communicate with you regarding updates, security alerts, and support messages.</li>
              <li>Monitor the usage of our platform and detect technical issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">4. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. 
              Your password and authentication tokens are encrypted and handled securely.
              However, please be aware that no security measures are perfect or impenetrable, and no method of 
              data transmission over the Internet can be guaranteed to be 100% secure. We strive to use commercially acceptable means to protect your Personal Data, but we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">5. Third-Party Services</h2>
            <p>
              We may share your information with third-party vendors, service providers, and contractors who perform 
              services for us, such as database hosting, data analysis, and email delivery. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">6. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, update, or delete the personal information we have on you. 
              You can manage most of your data directly from your account dashboard. If you need assistance, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-4 uppercase">8. Contact Us</h2>
            <p>
              If you have any questions or comments about this Privacy Policy, please contact us at: 
              <br />
              <strong className="text-[#F26A3D]">privacy@logicpup.com</strong>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
