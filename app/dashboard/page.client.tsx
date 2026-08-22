"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  FolderCode,
  Trophy,
  Play,
  RotateCcw,
  Zap,
  Rocket,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  useProjectsStore,
  PROJECT_TEMPLATES,
} from "@/components/visual-editor/projects/projectStore";
import { CODING_LEVELS } from "@/components/visual-editor/learning/levelsData";
import { IconRenderer } from "@/components/visual-editor/components/IconRenderer";
import { useMounted } from "@/lib/useMounted";
import posthog from "posthog-js";
import { useEPStore } from "@/lib/ep-store";

export default function HomePage() {
  const router = useRouter();
  const mounted = useMounted();
  const {
    projects,
    completedChallengeIds,
    createProject,
    isLevelUnlocked,
    isLevelMastered,
    getLevelMasteryPercent,
    getTotalEarnedPoints,
  } = useProjectsStore();
  const { ep, loadState } = useEPStore();

  useEffect(() => {
    loadState();
  }, [loadState]);

  const activeProjects = mounted
    ? projects.filter(
        (p) =>
          p.status !== "archived" &&
          p.id !== "challenge-sandbox" &&
          !p.learningState?.challengeId,
      )
    : [];
  const recentProject = mounted ? activeProjects[0] : undefined;
  const totalPoints = mounted ? getTotalEarnedPoints() + (ep || 0) : 0;
  const currentActiveLevel = mounted
    ? CODING_LEVELS.find(
        (l) => isLevelUnlocked(l.levelNumber) && !isLevelMastered(l.id),
      ) || CODING_LEVELS[0]
    : CODING_LEVELS[0];

  function handleCreateFromTemplate(templateId: string) {
    const tmpl = PROJECT_TEMPLATES.find((t) => t.id === templateId);
    const newProj = createProject(templateId, tmpl?.name, tmpl?.description);
    posthog.capture("project_created", {
      project_id: newProj.id,
      template_id: templateId,
      creation_source: "dashboard",
    });
    router.push(`/projects/${newProj.id}/editor`);
  }

  function formatTimeAgo(isoString: string) {
    if (!mounted) return "Recently";
    try {
      const diffSec = Math.floor(
        (Date.now() - new Date(isoString).getTime()) / 1000,
      );
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return "Recently";
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 py-6">
      {/* ── Featured Announcement Banner ── */}
      <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 shadow-sm flex flex-col md:flex-row md:items-center items-start justify-between gap-6 rounded">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#F26A3D]">
            LOGICPUP PLATFORM 🐾
          </span>
          <h1 className="text-xl font-bold uppercase tracking-tight mt-1 mb-2">
            Visual Python Programming & Coding Levels
          </h1>
          <p className="text-xs text-[#555555] leading-relaxed hidden md:block">
            Master variables, logic, loops, math algorithms, and games through
            progressive coding levels with automated interactive challenges. No
            syntax bites!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/learn"
            className="px-4 py-2 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold uppercase rounded no-underline flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Explore 10 Levels</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-3 sm:p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="min-w-0 w-full">
            <div className="text-[9px] sm:text-[10px] font-bold text-[#888888] uppercase tracking-wider truncate">
              My Projects
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono mt-0.5 sm:mt-1 truncate">
              {mounted ? (
                activeProjects.length
              ) : (
                <span className="w-8 h-5 sm:h-6 bg-[#E5E2DA] rounded animate-pulse inline-block" />
              )}
            </div>
          </div>
          <div className="hidden sm:flex w-10 h-10 rounded bg-[#FAF9F5] border border-[#E5E2DA] items-center justify-center text-[#F26A3D] shrink-0">
            <FolderCode size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-3 sm:p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="min-w-0 w-full">
            <div className="text-[9px] sm:text-[10px] font-bold text-[#888888] uppercase tracking-wider truncate">
              Earned XP
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono mt-0.5 sm:mt-1 text-[#F26A3D] truncate">
              {mounted ? (
                `⭐ ${totalPoints}`
              ) : (
                <span className="w-12 h-5 sm:h-6 bg-[#E5E2DA] rounded animate-pulse inline-block" />
              )}
            </div>
          </div>
          <div className="hidden sm:flex w-10 h-10 rounded bg-[#FAF9F5] border border-[#E5E2DA] items-center justify-center text-[#F26A3D] shrink-0">
            <Zap size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-3 sm:p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="min-w-0 w-full">
            <div className="text-[9px] sm:text-[10px] font-bold text-[#888888] uppercase tracking-wider truncate">
              Challenges
            </div>
            <div className="text-lg sm:text-2xl font-bold font-mono mt-0.5 sm:mt-1 text-[#287A52] truncate">
              {mounted ? (
                completedChallengeIds.length
              ) : (
                <span className="w-8 h-5 sm:h-6 bg-[#E5E2DA] rounded animate-pulse inline-block" />
              )}
            </div>
          </div>
          <div className="hidden sm:flex w-10 h-10 rounded bg-[#FAF9F5] border border-[#E5E2DA] items-center justify-center text-[#287A52] shrink-0">
            <Trophy size={20} />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-3 sm:p-4 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="min-w-0 w-full">
            <div className="text-[9px] sm:text-[10px] font-bold text-[#888888] uppercase tracking-wider truncate">
              Current Level
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase mt-0.5 sm:mt-1 truncate">
              {mounted ? (
                `Lvl ${currentActiveLevel.levelNumber}: ${currentActiveLevel.badge}`
              ) : (
                <span className="w-16 sm:w-20 h-4 sm:h-5 bg-[#E5E2DA] rounded animate-pulse inline-block" />
              )}
            </div>
          </div>
          <div className="hidden sm:flex w-10 h-10 rounded bg-[#FAF9F5] border border-[#E5E2DA] items-center justify-center text-[#356A9A] shrink-0">
            <IconRenderer name={currentActiveLevel.icon} size={20} />
          </div>
        </div>
      </div>

      {/* ── Active Level Highlight & Recent Project ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Recommended Level Challenge Card */}
        <div className="md:col-span-2 bg-[#FFFFFF] border border-[#D8D4CC] p-6 rounded flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded text-[#F26A3D] line-clamp-1 mr-2">
                RECOMMENDED CODING LEVEL
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#888] shrink-0">
                LEVEL {currentActiveLevel.levelNumber} OF 10
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold uppercase mb-2 flex items-start sm:items-center gap-2">
              <span className="shrink-0 pt-0.5 sm:pt-0">
                <IconRenderer name={currentActiveLevel.icon} size={20} />
              </span>
              <span>{currentActiveLevel.title}</span>
            </h2>
            <p className="text-xs text-[#555555] mb-4 leading-relaxed">
              {currentActiveLevel.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="text-[10px] font-bold uppercase text-[#888]">
                Level Challenges & Progress:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentActiveLevel.challenges.slice(0, 4).map((ch) => {
                  const isDone =
                    mounted && completedChallengeIds.includes(ch.id);
                  return (
                    <div
                      key={ch.id}
                      className={`p-2.5 rounded border text-xs flex items-center justify-between ${
                        isDone
                          ? "bg-[#E2F0D9] border-[#C3E6CB] text-[#155724]"
                          : "bg-[#FAF9F5] border-[#D8D4CC] text-[#171717]"
                      }`}
                    >
                      <div className="pr-2 min-w-0">
                        <div className="font-bold line-clamp-2">{ch.title}</div>
                        <div className="text-[10px] font-mono opacity-80 uppercase">
                          {ch.difficulty} • {ch.points} pts
                        </div>
                      </div>
                      {isDone ? (
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-[#287A52]"
                        />
                      ) : (
                        <span className="text-[10px] font-mono px-1 bg-white border border-[#D8D4CC] rounded">
                          START
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E2DA] flex items-center justify-between">
            <span className="text-xs font-mono text-[#888]">
              {mounted ? getLevelMasteryPercent(currentActiveLevel.id) : 0}%
              Mastered
            </span>
            <Link
              href={`/dashboard/learn/${currentActiveLevel.id}`}
              className="px-4 py-2 bg-[#171717] hover:bg-[#F26A3D] text-white text-xs font-bold uppercase rounded no-underline flex items-center gap-1.5 transition-colors"
            >
              <span>Continue Level {currentActiveLevel.levelNumber}</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Recent Project Quick-Action Card */}
        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 rounded flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded text-[#555]">
                RECENT PROJECT
              </span>
              {recentProject && (
                <span className="text-[10px] font-mono text-[#888]">
                  {formatTimeAgo(recentProject.updatedAt)}
                </span>
              )}
            </div>

            {recentProject ? (
              <div>
                <h3 className="text-sm font-bold uppercase mb-1 line-clamp-2 wrap-break-word">
                  {recentProject.name}
                </h3>
                <p className="text-xs text-[#666666] line-clamp-3 mb-4">
                  {recentProject.description || "Visual Python program."}
                </p>
                <div className="text-[10px] font-mono text-[#888] space-y-1">
                  <div>Language: Python</div>
                  <div>
                    Blocks: {recentProject.visualProgram?.nodes?.length || 0}
                  </div>
                  <div>Runs logged: {recentProject.runs?.length || 0}</div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-[#888]">
                <FolderCode size={28} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No projects created yet.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E5E2DA]">
            {recentProject ? (
              <Link
                href={`/projects/${recentProject.id}/editor`}
                className="w-full py-2 bg-[#171717] hover:bg-[#F26A3D] text-white text-xs font-bold uppercase rounded no-underline flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play size={12} />
                <span>Open in Editor</span>
              </Link>
            ) : (
              <button
                onClick={() => handleCreateFromTemplate("empty")}
                className="w-full py-2 bg-[#F26A3D] text-white text-xs font-bold uppercase rounded border-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play size={12} />
                <span>Create Blank Project</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Starter Templates Strip ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight">
              Starter Project Templates
            </h3>
            <p className="text-xs text-[#666666]">
              Launch a pre-configured algorithm or interactive template.
            </p>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-xs font-bold uppercase text-[#F26A3D] hover:underline no-underline"
          >
            View All Projects ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PROJECT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleCreateFromTemplate(tmpl.id)}
              className="bg-[#FFFFFF] border border-[#D8D4CC] p-5 rounded hover:border-[#F26A3D] cursor-pointer transition-colors flex flex-col justify-between group shadow-xs"
              style={{ minHeight: 140 }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded text-[#F26A3D]">
                    {tmpl.badge}
                  </span>
                  <ArrowRight
                    size={13}
                    className="text-[#888] group-hover:text-[#F26A3D] transition-colors"
                  />
                </div>
                <h4 className="text-xs font-bold uppercase mb-1">
                  {tmpl.name}
                </h4>
                <p className="text-xs text-[#666666] line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E2DA] mt-3 text-[10px] font-mono text-[#888] flex items-center justify-between">
                <span>{tmpl.starterNodes.length} Blocks</span>
                <span className="text-[#F26A3D] font-bold group-hover:underline">
                  Use Template
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
