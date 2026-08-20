import React from 'react';
import {
  Video,
  Layers,
  XCircle,
  CheckCircle2,
  Clock,
  Zap,
  Code2,
} from 'lucide-react';

export const ValuePropComparison: React.FC = () => {
  return (
    <section
      id="value-proposition-section"
      className="py-16 md:py-24 border-y border-black/[0.06] bg-white/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/[0.06] text-xs font-mono font-semibold text-[#806A55] shadow-xs">
            <span>THE VISUAL FLOW ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121212] tracking-tight">
            Stop Staring at Syntax Errors. Understand the Logic Flow.
          </h2>
          <p className="text-base sm:text-lg text-[#666666]">
            Learning Python by reading syntax can feel overwhelming. Flowcharts make control flow, if/else branching, and while loops crystal clear.
          </p>
        </div>

        {/* 2-Column Minimalist Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Column 1: Traditional Passive Video Learning */}
          <div
            id="comparison-card-traditional"
            className="rounded-2xl bg-white/70 backdrop-blur-md border border-black/[0.06] p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F6F0] text-[#666666] flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#121212]">Memorizing Python Syntax</h3>
                    <p className="text-xs font-mono text-[#888888]">Traditional text-heavy approach</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-black/[0.04] text-[11px] font-mono font-semibold text-[#666666]">
                  Abstract & Confusing
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-[#666666]">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Invisible Execution:</strong> You cannot see how variables change in memory as lines execute.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#666666]">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Indentation & Syntax Traps:</strong> Beginners spend 80% of their time debugging missing colons and spaces.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#666666]">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Vague Branching:</strong> Complex nested if/elif/else conditions are difficult to trace mentally.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#666666]">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Disconnect from Code:</strong> Difficulty converting abstract flowchart ideas into actual runnable code.
                  </span>
                </div>
              </div>
            </div>

            {/* Simulation Footer Metric */}
            <div className="mt-8 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono text-[#888888]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Time to First Working Program: Days
              </span>
              <span className="font-semibold text-red-500">Frustrating Debugging</span>
            </div>
          </div>

          {/* Column 2: TeachFlow Visual Python Flowchart */}
          <div
            id="comparison-card-teachflow"
            className="rounded-2xl bg-white backdrop-blur-md border border-black/[0.08] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F26A3D] text-white flex items-center justify-center shadow-xs">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#121212]">TeachFlow Python Flowcharts</h3>
                    <p className="text-xs font-mono text-[#F26A3D] font-semibold">Visual 1:1 code execution</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#F26A3D]/10 text-[11px] font-mono font-bold text-[#F26A3D]">
                  Intuitive Mastery
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-[#121212]">
                  <CheckCircle2 className="w-4 h-4 text-[#287A52] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Clear 4-Way Wire Connections:</strong> Wire START &rarr; Process &rarr; Input &rarr; Condition &rarr; Output &rarr; END effortlessly.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#121212]">
                  <CheckCircle2 className="w-4 h-4 text-[#287A52] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Step-by-Step Glowing Trace:</strong> Watch the active block glow as code executes with live memory variables.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#121212]">
                  <CheckCircle2 className="w-4 h-4 text-[#287A52] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">100% Real Python 3 Output:</strong> Flowcharts instantly emit clean, idiomatic PEP 8 Python 3.12 scripts.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#121212]">
                  <CheckCircle2 className="w-4 h-4 text-[#287A52] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#121212]">Zero Installation Required:</strong> Run simulations, test inputs, and explore algorithms right in the browser.
                  </span>
                </div>
              </div>
            </div>

            {/* Simulation Footer Metric */}
            <div className="mt-8 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono text-[#121212]">
              <span className="flex items-center gap-1.5 text-[#287A52] font-semibold">
                <Zap className="w-3.5 h-3.5 text-[#F26A3D]" /> Time to First Working Program: 60 Seconds
              </span>
              <span className="font-bold text-[#287A52] bg-[#287A52]/10 px-2 py-0.5 rounded-full">
                96% Conceptual Clarity
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
