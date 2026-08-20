"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Compass } from "lucide-react";
import { LevelDetailView } from "@/components/visual-editor/components/LevelDetailView";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { CODING_LEVELS } from "@/components/visual-editor/learning/levelsData";
import { useMounted } from "@/lib/useMounted";

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
          href="/learn"
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

  function handleStartChallenge(challengeId: string) {
    const project = startLevelChallenge(level!.id, challengeId);
    router.push(`/projects/${project.id}/editor?level=${level!.id}&challenge=${challengeId}`);
  }

  return (
    <LevelDetailView
      level={level}
      isUnlocked={unlocked}
      completedChallengeIds={completedIds}
      onBack={() => router.push("/learn")}
      onStartChallenge={handleStartChallenge}
    />
  );
}
