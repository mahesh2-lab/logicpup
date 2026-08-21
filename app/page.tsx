import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

export const metadata: Metadata = {
  title: "LogicPup",
  description: "LogicPup is an educational platform that teaches Python programming through an interactive, visual interface.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F1EA] text-[#171717]">
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#E5E2DA] bg-white">
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" href="/" />
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/privacy" className="text-sm font-bold text-[#888] hover:text-[#171717]">Privacy</Link>
          <Link href="/login" className="px-4 py-2 bg-[#F26A3D] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#D95A30] transition-colors">Sign In / Get Started</Link>
        </nav>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 space-y-12">
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
            <Link href="/privacy" className="text-[#F26A3D] font-bold hover:underline">Privacy Policy</Link>.
          </p>
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-[#E5E2DA] text-center text-sm text-[#888]">
        <p>&copy; {new Date().getFullYear()} LogicPup. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/privacy" className="hover:text-[#171717] font-bold">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#171717] font-bold">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
