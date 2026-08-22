"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { CODING_LEVELS } from "@/components/visual-editor/learning/levelsData";
import { IconRenderer } from "@/components/visual-editor/components/IconRenderer";
import { useMounted } from "@/lib/useMounted";
import { useEPStore } from "@/lib/ep-store";

export default function LearnHubPage() {
  const mounted = useMounted();
  const {
    completedChallengeIds,
    isLevelUnlocked,
    isLevelMastered,
    getLevelMasteryPercent,
    getTotalEarnedPoints,
  } = useProjectsStore();

  const { ep, loadState } = useEPStore();
  
  React.useEffect(() => {
    loadState();
  }, [loadState]);

  const totalPoints = mounted ? getTotalEarnedPoints() + (ep || 0) : 0;
  const masteredLevelsCount = mounted ? CODING_LEVELS.filter((l) => isLevelMastered(l.id)).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D4CC]">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={20} color="#F26A3D" />
            <h1 className="text-xl font-bold uppercase tracking-tight">
              Coding Levels & Mastery Path
            </h1>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Follow the proven educational flow:{" "}
            <strong className="text-[#171717]">Level ➔ Learn Concepts ➔ Practice Challenges ➔ Master ➔ Next Level</strong>.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <div className="font-mono text-xl font-bold text-[#F26A3D]">
              ⭐ {totalPoints} XP
            </div>
            <span className="text-[10px] uppercase font-bold text-[#888]">
              {masteredLevelsCount} of 10 Levels Mastered
            </span>
          </div>
        </div>
      </div>

      {/* Level Cards Grid */}
      <div className="space-y-4">
        {CODING_LEVELS.map((lvl) => {
          const unlocked = mounted ? isLevelUnlocked(lvl.levelNumber) : lvl.levelNumber === 1;
          const mastered = mounted ? isLevelMastered(lvl.id) : false;
          const masteryPercent = mounted ? getLevelMasteryPercent(lvl.id) : 0;
          const completedCount = mounted
            ? lvl.challenges.filter((c) => completedChallengeIds.includes(c.id)).length
            : 0;

          return (
            <div
              key={lvl.id}
              className={`bg-[#FFFFFF] border rounded p-5 transition-colors relative shadow-xs ${
                mastered
                  ? "border-[#287A52]/50 bg-[#F4F9F4]"
                  : unlocked
                  ? "border-[#D8D4CC] hover:border-[#F26A3D]"
                  : "border-[#E5E2DA] opacity-60 bg-[#FAF9F5]"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded flex items-center justify-center shrink-0 border ${
                      mastered
                        ? "bg-[#287A52] text-white border-[#287A52]"
                        : unlocked
                        ? "bg-[#FAF9F5] text-[#F26A3D] border-[#D8D4CC]"
                        : "bg-[#E5E2DA] text-[#888] border-[#D8D4CC]"
                    }`}
                  >
                    {mastered ? (
                      <CheckCircle2 size={24} />
                    ) : unlocked ? (
                      <IconRenderer name={lvl.icon} size={24} />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded text-[#555]">
                        LEVEL {lvl.levelNumber}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
                        {lvl.badge}
                      </span>
                      {mastered && (
                        <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#E2F0D9] text-[#155724] border border-[#C3E6CB] rounded flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>MASTERED</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold uppercase mb-1">{lvl.title}</h2>
                    <p className="text-xs text-[#666666] max-w-xl leading-relaxed">
                      {lvl.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-3 text-[10px] sm:text-[11px] font-mono text-[#888]">
                      <span>
                        Challenges: <strong>{completedCount}</strong> / {lvl.challenges.length} completed
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {lvl.levelNumber === 1 || unlocked
                          ? `Complete all ${lvl.challenges.length} challenges to unlock Level ${lvl.levelNumber + 1}`
                          : `Locked • Complete all challenges in Level ${lvl.levelNumber - 1} to unlock`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-[#E5E2DA]">
                  <span className="text-xs font-mono font-bold text-[#888]">
                    {masteryPercent}%
                  </span>

                  {unlocked ? (
                    <Link
                      href={`/dashboard/learn/${lvl.id}`}
                      className="px-4 py-2 bg-[#171717] hover:bg-[#F26A3D] text-white text-xs font-bold uppercase rounded no-underline flex items-center gap-1.5 transition-colors"
                    >
                      <span>{mastered ? "Review" : "Open"}</span>
                      <ChevronRight size={13} />
                    </Link>
                  ) : (
                    <div className="px-3 py-1.5 bg-[#E5E2DA] text-[#888] text-xs font-mono uppercase rounded flex items-center gap-1">
                      <Lock size={12} />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#E5E2DA] rounded-full overflow-hidden mt-4">
                <div
                  className={`h-full transition-all duration-300 ${
                    mastered ? "bg-[#287A52]" : "bg-[#F26A3D]"
                  }`}
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
