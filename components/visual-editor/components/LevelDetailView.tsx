"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Trophy,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  Code2,
  Award,
} from "lucide-react";
import { DynamicIcon } from "./IconRenderer";
import type { CodingLevel, LevelChallenge, ChallengeDifficulty } from "../projects/types";

interface LevelDetailViewProps {
  level: CodingLevel;
  isUnlocked: boolean;
  completedChallengeIds: string[];
  onBack: () => void;
  onStartChallenge: (challengeId: string) => void;
}

export function LevelDetailView({
  level,
  isUnlocked,
  completedChallengeIds,
  onBack,
  onStartChallenge,
}: LevelDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"learn" | "challenges">("learn");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | ChallengeDifficulty>("all");

  const completedCount = level.challenges.filter((c) =>
    completedChallengeIds.includes(c.id)
  ).length;
  const isMastered = completedCount >= level.requiredChallengesToMaster;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / level.challenges.length) * 100)
  );

  const filteredChallenges = level.challenges.filter((c) =>
    selectedDifficulty === "all" ? true : c.difficulty === selectedDifficulty
  );

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full p-6 space-y-6"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      {/* Top Navigation & Level Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs font-bold uppercase tracking-wider text-[#666] hover:text-[#171717] flex items-center gap-1.5 bg-transparent border-none cursor-pointer mb-3 p-0"
        >
          <ArrowLeft size={14} />
          <span>Back to All Levels</span>
        </button>

        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-4 md:p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#F4F1EA] border border-[#D8D4CC] flex items-center justify-center text-[#F26A3D] shrink-0">
              <DynamicIcon name={level.icon} size={28} color="#F26A3D" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold font-mono uppercase bg-[#F26A3D]/10 text-[#F26A3D] px-2 py-0.5 rounded">
                  LEVEL 0{level.levelNumber}
                </span>
                <span className="text-[11px] font-bold font-mono uppercase bg-[#F4F1EA] border border-[#D8D4CC] text-[#555] px-2 py-0.5 rounded">
                  {level.badge}
                </span>
                {isMastered && (
                  <span className="text-[11px] font-bold bg-[#287A52] text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <Check size={11} strokeWidth={3} /> MASTERED
                  </span>
                )}
              </div>

              <h1 className="text-xl font-bold text-[#171717]">{level.title}</h1>
              <p className="text-xs text-[#666] mt-1 hidden md:block">{level.subtitle} • {level.description}</p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto md:text-right pt-4 md:pt-0 border-t md:border-t-0 border-[#E5E2DA]">
            <div className="text-sm font-bold text-[#171717]">
              {completedCount}/{level.challenges.length} Solved
            </div>
            <div className="w-32 bg-[#E5E2DA] h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-[#287A52] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-[#888] mt-1">
              {progressPercent}% COMPLETE
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-[#D8D4CC] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("learn")}
          className={`pb-2.5 flex items-center gap-2 bg-transparent border-none cursor-pointer tracking-wider uppercase transition-colors ${
            activeTab === "learn"
              ? "text-[#F26A3D] border-b-2 border-b-[#F26A3D]"
              : "text-[#666] hover:text-[#171717]"
          }`}
        >
          <BookOpen size={14} />
          <span>1. Learn Concepts</span>
        </button>

        <button
          onClick={() => setActiveTab("challenges")}
          className={`pb-2.5 flex items-center gap-2 bg-transparent border-none cursor-pointer tracking-wider uppercase transition-colors ${
            activeTab === "challenges"
              ? "text-[#F26A3D] border-b-2 border-b-[#F26A3D]"
              : "text-[#666] hover:text-[#171717]"
          }`}
        >
          <Trophy size={14} />
          <span>2. Practice Challenges ({level.challenges.length})</span>
        </button>
      </div>

      {/* Tab 1: Learn Concepts */}
      {activeTab === "learn" && (
        <div className="space-y-6 overflow-y-auto pb-8">
          {/* Main Concept Card */}
          <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F26A3D] uppercase">
              <Sparkles size={16} />
              <span>{level.learning.conceptTitle}</span>
            </div>
            <p className="text-sm font-semibold text-[#171717] bg-[#FAF9F5] p-3 rounded border border-[#E5E2DA]">
              {level.learning.summary}
            </p>
            <div className="space-y-2 text-xs text-[#444] leading-relaxed">
              {level.learning.explanation.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Visual Blocks & Python Code Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Blocks Guide */}
            <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-5 rounded-lg space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <DynamicIcon name={level.icon} size={15} color="#356A9A" />
                <span>Visual Blocks in this Level</span>
              </div>
              <div className="space-y-3">
                {level.learning.blockExamples.map((b, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF9F5] border border-[#E5E2DA] rounded text-xs">
                    <div className="font-bold text-[#171717] mb-1">{b.name}</div>
                    <p className="text-[#555] text-[11px] mb-2">{b.purpose}</p>
                    <pre className="text-[11px] font-mono bg-[#FFFFFF] p-2 rounded border border-[#E5E2DA] text-[#356A9A]">
                      {b.exampleCode}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Python Syntax Comparison */}
            <div className="bg-[#171717] text-white p-5 rounded-lg space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#F26A3D] flex items-center gap-1.5 font-mono">
                <Code2 size={15} />
                <span>Python Syntax Reference</span>
              </div>
              <div className="space-y-3">
                {level.learning.codeSnippets.map((s, idx) => (
                  <div key={idx} className="p-3 bg-[#242424] border border-[#333] rounded text-xs">
                    <div className="font-bold text-[#E5E2DA] mb-1">{s.title}</div>
                    <pre className="text-[11px] font-mono bg-[#141414] p-2 rounded text-[#34D399] overflow-x-auto">
                      {s.pythonCode}
                    </pre>
                    <p className="text-[#888] text-[11px] mt-1.5">{s.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Common Mistakes & Gotchas */}
          <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-5 rounded-lg space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-[#C94A45] flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>Common Mistakes & How to Fix Them</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {level.learning.commonMistakes.map((m, idx) => (
                <div key={idx} className="p-3 bg-[#FFF8F8] border border-[#C94A45]/30 rounded text-xs space-y-1.5">
                  <div className="text-[#C94A45] font-bold">❌ Mistake: {m.mistake}</div>
                  <div className="text-[#287A52] font-bold">✓ Fix: {m.fix}</div>
                  <p className="text-[#666] text-[11px]">{m.why}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Takeaways & Action */}
          <div className="bg-[#F4F1EA] border border-[#D8D4CC] p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase text-[#171717] flex items-center gap-1">
                <Lightbulb size={14} color="#F26A3D" />
                <span>Ready to Code?</span>
              </div>
              <p className="text-xs text-[#555]">
                Put what you learned into action across {level.challenges.length} progressive challenges.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("challenges")}
              className="w-full md:w-auto py-2.5 px-5 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold rounded uppercase tracking-wider flex items-center justify-center gap-2 border-none cursor-pointer shrink-0"
            >
              <span>Start Challenges</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Practice Challenges */}
      {activeTab === "challenges" && (
        <div className="space-y-4 overflow-y-auto pb-8">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 text-xs font-bold rounded-full uppercase cursor-pointer border transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-[#171717] text-white border-[#171717]"
                    : "bg-[#FFFFFF] text-[#666] border-[#D8D4CC] hover:border-[#171717]"
                }`}
              >
                {diff === "all" ? "All Difficulties" : diff}
              </button>
            ))}
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((ch, idx) => {
              const isDone = completedChallengeIds.includes(ch.id);

              return (
                <div
                  key={ch.id}
                  className={`bg-[#FFFFFF] border p-5 rounded-lg shadow-sm flex flex-col justify-between transition-all ${
                    isDone ? "border-[#287A52] bg-[#F7FDF9]" : "border-[#D8D4CC] hover:border-[#F26A3D]"
                  }`}
                  style={{ minHeight: 200 }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#555] bg-[#F4F1EA] px-2 py-0.5 rounded border border-[#D8D4CC]">
                        {ch.formatLabel}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#F26A3D]">
                        ⭐ {ch.points} PTS
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#171717] mb-1">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-[#666] leading-relaxed mb-3">
                      {ch.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E2DA] flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        ch.difficulty === "easy"
                          ? "bg-[#287A52]/10 text-[#287A52]"
                          : ch.difficulty === "medium"
                          ? "bg-[#F26A3D]/10 text-[#F26A3D]"
                          : "bg-[#C94A45]/10 text-[#C94A45]"
                      }`}
                    >
                      {ch.difficulty}
                    </span>

                    {isDone ? (
                      <button
                        onClick={() => onStartChallenge(ch.id)}
                        className="py-1 px-3 bg-[#287A52] text-white text-xs font-bold rounded flex items-center gap-1 border-none cursor-pointer"
                      >
                        <Check size={11} strokeWidth={3} />
                        <span>Solved</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartChallenge(ch.id)}
                        className="py-1 px-3 bg-[#171717] hover:bg-[#F26A3D] text-white text-xs font-bold rounded flex items-center gap-1 border-none cursor-pointer transition-colors"
                      >
                        <span>Start</span>
                        <Play size={10} fill="currentColor" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
