"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Compass } from "lucide-react";
import { LevelDetailView } from "@/components/visual-editor/components/LevelDetailView";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { CODING_LEVELS } from "@/components/visual-editor/learning/levelsData";
import { useMounted } from "@/lib/useMounted";
import posthog from "posthog-js";

interface LevelPageProps {
  params: Promise<{
    levelId: string;
  }>;
}

export default function LevelDetailPage({ params }: LevelPageProps) {
  const router = useRouter();
  const { levelId } = use(params);
  const mounted = useMounted();
  const { completedChallengeIds, isLevelUnlocked, startLevelChallenge } = useProjectsStore();

  const level = CODING_LEVELS.find((l) => l.id === levelId);

  if (!level) {
    return (
      <div className="max-w-md mx-auto py-16 text-center bg-[#FFFFFF] border border-[#D8D4CC] p-8 rounded">
        <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#D8D4CC] flex items-center justify-center mx-auto mb-4 text-[#C94A45]">
          <Compass size={24} />
        </div>
        <h2 className="text-base font-bold uppercase mb-2">Level Not Found</h2>
        <p className="text-xs text-[#666] mb-6">
          The coding level <code className="font-mono text-[#F26A3D]">{levelId}</code> does not exist.
        </p>
        <Link
          href="/dashboard/learn"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-white text-xs font-bold uppercase rounded no-underline"
        >
          <ArrowLeft size={13} />
          Back to Levels
        </Link>
      </div>
    );
  }

  const unlocked = mounted ? isLevelUnlocked(level.levelNumber) : level.levelNumber === 1;
  const completedIds = mounted ? completedChallengeIds : [];

  if (mounted && !unlocked) {
    const prevLevel = CODING_LEVELS.find((l) => l.levelNumber === level.levelNumber - 1);
    const prevCompletedCount = prevLevel
      ? prevLevel.challenges.filter((c) => completedChallengeIds.includes(c.id)).length
      : 0;

    return (
      <div className="max-w-lg mx-auto py-16 text-center bg-[#FFFFFF] border border-[#D8D4CC] p-8 rounded shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#D8D4CC] flex items-center justify-center mx-auto mb-4 text-[#888]">
          <span className="text-2xl">🔒</span>
        </div>
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C94A45] mb-1">
          Level Locked
        </div>
        <h2 className="text-lg font-bold uppercase mb-2">
          Level 0{level.levelNumber}: {level.title} is Locked
        </h2>
        <p className="text-xs text-[#666] leading-relaxed mb-6">
          You must complete all challenges in previous levels before unlocking this level.
          {prevLevel && (
            <span className="block mt-2 font-medium text-[#171717]">
              Current Progress in Level {prevLevel.levelNumber} ({prevLevel.title}):{" "}
              <strong>{prevCompletedCount}/{prevLevel.challenges.length}</strong> challenges completed.
            </span>
          )}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard/learn"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAF9F5] border border-[#D8D4CC] hover:border-[#171717] text-[#171717] text-xs font-bold uppercase rounded no-underline transition-colors"
          >
            <ArrowLeft size={13} />
            <span>All Levels</span>
          </Link>
          {prevLevel && (
            <Link
              href={`/learn/${prevLevel.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold uppercase rounded no-underline transition-colors shadow-xs"
            >
              <span>Go to Level 0{prevLevel.levelNumber}</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  function handleStartChallenge(challengeId: string) {
    if (!unlocked) return;
    const project = startLevelChallenge(level!.id, challengeId);
    posthog.capture("challenge_started", {
      challenge_id: challengeId,
      level_id: level!.id,
      project_id: project.id,
    });
    router.push(`/projects/${project.id}/editor?level=${level!.id}&challenge=${challengeId}`);
  }

  return (
    <LevelDetailView
      level={level}
      isUnlocked={unlocked}
      completedChallengeIds={completedIds}
      onBack={() => router.push("/dashboard/learn")}
      onStartChallenge={handleStartChallenge}
    />
  );
}
