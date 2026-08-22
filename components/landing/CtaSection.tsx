"use client";
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Boxes,
  Zap,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export const CtaSection: React.FC = () => {
  return (
    <section
      id="logicpup-final-cta"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The big, beautiful call-to-action box at the bottom of the page */}
        <div className="rounded-sm bg-white text-[#171717] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#D8D4CC]">
          {/* Some soft glowing lights to make things feel magical */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-sm bg-[#F26A3D]/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-sm bg-[#356A9A]/20 blur-3xl pointer-events-none" />

          {/* That cool techy background grid that flickers */}
          <FlickeringGrid
            className="absolute inset-0 z-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* A tiny little badge to grab attention */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#F4F1EA] backdrop-blur-md border border-[#D8D4CC] text-xs font-mono font-semibold text-[#171717]">
              <Sparkles className="w-3.5 h-3.5 text-[#F26A3D]" />
              <span>
                LogicPup Python Playground • No Leash, No Install Required 🐾
              </span>
            </div>

            {/* The big bold message! */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] leading-tight">
              Master Python Logic Without <br />
              <span className="text-[#F26A3D]">Barking at Syntax Errors.</span>
            </h2>

            {/* A quick explainer of what they're getting into */}
            <p className="text-base sm:text-lg text-[#555555] max-w-xl mx-auto leading-relaxed">
              Connect variables, inputs, conditionals, and loops to visually
              build and run real Python 3 programs right in your browser. Good
              boy, clean code.
            </p>

            {/* Time for action! The big sign-up buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                id="cta-start-free-btn"
                onClick={() => {
                  window.location.href = "/login?mode=signup";
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F26A3D] hover:bg-[#D9552A] active:scale-98 text-white font-bold text-base rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Start Learning Free (No Bones About It)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="cta-open-playground-btn"
                onClick={() => document.getElementById('interactive-demo-playground')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#171717] font-bold text-base rounded-sm border border-[#D8D4CC] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-[#60A5FA]" />
                <span>Try Flowchart Playground 🐾</span>
              </button>
            </div>

            {/* A few promises to make them feel safe and warm */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#555555]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" /> 100% Free
                Core Curriculum
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" /> Instant
                Python 3 Code Emission
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" /> Live Variable
                Sniffing & Inspection
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
