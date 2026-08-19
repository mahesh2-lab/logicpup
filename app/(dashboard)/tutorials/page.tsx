"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Play,
  Terminal,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { CODING_LEVELS } from "@/components/visual-editor/learning/levelsData";

export default function TutorialsPage() {
  const guides = [
    {
      id: "quick-start",
      title: "Visual Programming 101",
      category: "Getting Started",
      readTime: "3 min read",
      description: "Learn how statement blocks, input blocks, and print blocks link together to form real executable Python code.",
      badge: "BEGINNER",
    },
    {
      id: "conditions-guide",
      title: "Condition Logic & Branching",
      category: "Core Concepts",
      readTime: "5 min read",
      description: "Understand True and False execution paths, comparison operators (==, >, <), and nested decisions.",
      badge: "LOGIC",
    },
    {
      id: "loops-guide",
      title: "Mastering Loops & Repetition",
      category: "Core Concepts",
      readTime: "4 min read",
      description: "Learn when to use count loops (for i in range) vs while condition loops with break statements.",
      badge: "LOOPS",
    },
    {
      id: "functions-guide",
      title: "Custom Functions & Modular Code",
      category: "Advanced",
      readTime: "6 min read",
      description: "Define reusable functions, pass parameters, and return calculated results to keep algorithms clean.",
      badge: "FUNCTIONS",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Strip */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D4CC]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={20} color="#F26A3D" />
            <h1 className="text-xl font-bold uppercase tracking-tight">
              Documentation & Guides
            </h1>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Reference materials, visual block guides, and Python syntax cheat sheets.
          </p>
        </div>

        <Link
          href="/learn"
          className="px-4 py-2 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold uppercase rounded no-underline flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <span>Go to 10 Coding Levels</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 rounded hover:border-[#F26A3D] transition-colors flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded text-[#F26A3D]">
                  {guide.badge}
                </span>
                <span className="text-[10px] font-mono text-[#888]">{guide.readTime}</span>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">{guide.title}</h3>
              <p className="text-xs text-[#666666] leading-relaxed mb-4">
                {guide.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5E2DA] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#888]">{guide.category}</span>
              <span className="text-xs font-bold text-[#F26A3D] uppercase flex items-center gap-1">
                <span>Read Tutorial</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 10 Level Quick Reference */}
      <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 rounded">
        <h3 className="text-sm font-bold uppercase mb-2">10 Coding Levels Curriculum</h3>
        <p className="text-xs text-[#666666] mb-4">
          Each level includes visual explanations, code examples, interactive challenges, and mistake analysis.
        </p>

        <div className="grid grid-cols-5 gap-3">
          {CODING_LEVELS.map((lvl) => (
            <Link
              key={lvl.id}
              href={`/learn/${lvl.id}`}
              className="p-3 bg-[#FAF9F5] border border-[#D8D4CC] hover:border-[#F26A3D] rounded no-underline text-[#171717] transition-colors block"
            >
              <div className="text-[10px] font-mono font-bold text-[#F26A3D] uppercase">
                LVL {lvl.levelNumber}
              </div>
              <div className="text-xs font-bold uppercase truncate mt-0.5">{lvl.title}</div>
              <div className="text-[10px] font-mono text-[#888] mt-1">
                {lvl.challenges.length} challenges
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
