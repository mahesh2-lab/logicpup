import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | LogicPup — Visual Python Flowchart IDE",
  description:
    "LogicPup Privacy Policy detailing data collection, Google OAuth 2.0 user data compliance, and data protection practices.",
  alternates: {
    canonical: "https://logicpup.heymahesh.in/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F1EA] text-[#171717]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <div className="border-b border-[#D8D4CC] pb-8 mb-10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F26A3D] bg-[#F26A3D]/10 px-2.5 py-1 rounded-sm">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-4 mb-2 tracking-tight">
            LogicPup Privacy Policy
          </h1>
          <p className="text-sm text-[#777] font-mono">
            Last Updated: October 13, 2026 • Effective Date: October 13, 2026
          </p>
        </div>

        <div className="space-y-12 text-base text-[#333] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#171717] tracking-tight">
              1. About LogicPup & Application Purpose
            </h2>
            <p>
              Welcome to <strong>LogicPup</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). LogicPup is an educational web-based visual programming environment and flowchart IDE designed to teach Python programming to students, educators, and beginners.
            </p>
            <p>
              This Privacy Policy explains how LogicPup collects, uses, protects, and discloses personal information when you access our website (
              <a href="https://logicpup.heymahesh.in" className="text-[#F26A3D] underline">
                https://logicpup.heymahesh.in
              </a>
              ) and use our visual flowchart code editor and educational curriculum.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#171717] tracking-tight">
              2. Google OAuth 2.0 & Google User Data Policy
            </h2>
            <p>
              LogicPup offers sign-in via <strong>Google OAuth 2.0</strong> to provide a secure and seamless authentication experience without requiring you to create and remember a separate password.
            </p>

            <div className="p-5 rounded-sm bg-white border border-[#D8D4CC] space-y-3 shadow-xs">
              <h3 className="font-bold text-[#171717] text-sm uppercase tracking-wide text-[#F26A3D]">
                A. Google Data We Access
              </h3>
              <p className="text-sm text-[#555]">
                When you sign in using Google, we request access only to basic profile information:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-[#444]">
                <li><strong>Your Email Address:</strong> Used as your unique account identifier and to contact you with essential service notifications.</li>
                <li><strong>Your Name:</strong> Used to personalize your LogicPup workspace and dashboard.</li>
                <li><strong>Your Profile Picture URL:</strong> Used solely to display your avatar in the application navigation header.</li>
              </ul>
            </div>

            <div className="p-5 rounded-sm bg-white border border-[#D8D4CC] space-y-3 shadow-xs">
              <h3 className="font-bold text-[#171717] text-sm uppercase tracking-wide text-[#F26A3D]">
                B. How We Use Google User Data
              </h3>
              <p className="text-sm text-[#444]">
                Google user data is used exclusively to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-[#444]">
                <li>Create, authenticate, and manage your LogicPup user session.</li>
                <li>Associate your saved flowchart projects, Python scripts, and curriculum progress with your account.</li>
                <li>Ensure account security and prevent unauthorized access.</li>
              </ul>
            </div>

            <div className="p-5 rounded-sm bg-white border border-[#D8D4CC] space-y-3 shadow-xs">
              <h3 className="font-bold text-[#171717] text-sm uppercase tracking-wide text-[#F26A3D]">
                C. Google API Limited Use Disclosure
              </h3>
              <p className="text-sm text-[#222] font-medium leading-relaxed">
                LogicPup&rsquo;s use and transfer to any other app of information received from Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F26A3D] underline font-semibold"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </div>

            <div className="p-5 rounded-sm bg-white border border-[#D8D4CC] space-y-2 shadow-xs">
              <h3 className="font-bold text-[#171717] text-sm uppercase tracking-wide text-[#F26A3D]">
                D. No Selling, Sharing, or Advertising Use
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-[#444]">
                <li>We <strong>do not sell</strong> or license Google user data to any third parties or data brokers.</li>
                <li>We <strong>do not use</strong> Google user data to serve personalized advertisements or retargeting campaigns.</li>
                <li>We <strong>do not use</strong> Google user data to train generalized AI or machine learning foundation models.</li>
                <li>We <strong>do not transfer</strong> Google user data to third parties, except as strictly necessary to provide the LogicPup service (e.g., secure database storage).</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#171717] tracking-tight">
              3. Other Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Project & Workspace Data:</strong> Flowchart nodes, block connections, Python code snippets, and challenge completion states that you create inside the LogicPup editor.
              </li>
              <li>
                <strong>Log & Diagnostic Data:</strong> Browser type, operating system, and diagnostic error reports used to maintain and optimize the interactive IDE.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#171717] tracking-tight">
              4. Data Retention, Account Deletion & Revocation
            </h2>
            <p>
              We retain your account data and saved projects only for as long as your account remains active.
            </p>
            <div className="space-y-2">
              <p>
                <strong>How to Request Data Deletion:</strong> You may request full deletion of your account and all associated projects at any time by emailing us at{" "}
                <a href="mailto:maheshchopade133@gmail.com" className="text-[#F26A3D] underline font-semibold">
                  maheshchopade133@gmail.com
                </a>
                . Upon receiving your verified request, all personal information and projects will be permanently deleted from our primary databases within 30 days.
              </p>
              <p>
                <strong>Revoking Google Access:</strong> You can revoke LogicPup&rsquo;s access to your Google account at any time by visiting your{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F26A3D] underline font-semibold"
                >
                  Google Account Permissions Page
                </a>
                .
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#171717] tracking-tight">
              5. Data Security
            </h2>
            <p>
              We apply industry-standard technical and organizational security controls to protect your personal data. All data transmitted between your browser and LogicPup is encrypted using Transport Layer Security (TLS/HTTPS). User sessions and authentication credentials are encrypted and stored in secure infrastructure.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#171717] tracking-tight">
              6. Developer & Contact Information
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact the developer:
            </p>
            <div className="p-4 rounded-sm bg-white border border-[#D8D4CC] space-y-1 text-sm font-mono shadow-xs">
              <p><strong>Application:</strong> LogicPup</p>
              <p><strong>Website:</strong> https://logicpup.heymahesh.in</p>
              <p><strong>Developer:</strong> Mahesh</p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:maheshchopade133@gmail.com" className="text-[#F26A3D] underline">
                  maheshchopade133@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
