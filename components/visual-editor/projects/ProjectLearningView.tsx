"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, Square, ArrowRight, Lightbulb, Code2, Target, Trophy } from "lucide-react";
import { useProjectsStore } from "./projectStore";
import { getNextChallenge } from "../learning/levelsData";
import type { Project } from "./types";

interface ProjectLearningViewProps {
  project: Project;
}

export function ProjectLearningView({ project }: ProjectLearningViewProps) {
  const { completedChallengeIds, completeChallenge } = useProjectsStore();
  const challenge = project.learningState?.currentChallenge;
  const isCompleted = challenge ? completedChallengeIds.includes(challenge.id) : false;

  return (
    <div
      className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D4CC] mb-6">
        <div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#555555",
            }}
          >
            PROJECT CHALLENGE
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: "uppercase", marginTop: 2 }}>
            {challenge ? challenge.title : project.name}
          </h2>
          <p style={{ fontSize: 12, color: "#666666", marginTop: 2 }}>
            {challenge ? challenge.description : "Construct visual block algorithms in the editor."}
          </p>
        </div>

        {challenge && (
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-[#F26A3D]">
              ⭐ {challenge.points} PTS
            </div>
            <div className="text-[10px] font-mono uppercase text-[#888]">
              {isCompleted ? "SOLVED ✓" : "IN PROGRESS"}
            </div>
          </div>
        )}
      </div>

      {challenge ? (
        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase bg-[#F4F1EA] px-2 py-0.5 rounded border border-[#D8D4CC] text-[#555]">
              {challenge.formatLabel} • {challenge.difficulty}
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F5] border border-[#E5E2DA] rounded text-xs space-y-2">
            <div>
              <strong className="text-[#171717]">Goal: </strong>
              <span className="text-[#444]">{challenge.goal || challenge.description}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#F26A3D]">
              <Lightbulb size={12} />
              <span>Hint: {challenge.hint}</span>
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 pt-2">
            <Link
              href={`/projects/${project.id}/editor?level=${challenge.levelId || "level-1"}&challenge=${challenge.id}`}
              className="py-2 px-4 bg-[#FFFFFF] hover:bg-[#FAF9F5] border border-[#D8D4CC] text-[#171717] text-xs font-bold rounded uppercase flex items-center gap-1.5 no-underline transition-colors shadow-xs"
            >
              <span>Open in Editor</span>
              <ArrowRight size={13} />
            </Link>

            {isCompleted && (
              <button
                onClick={() => {
                  const activeLvlId = challenge.levelId || project.learningState?.levelId || "level-1";
                  const nextInfo = getNextChallenge(activeLvlId, challenge.id);
                  if (nextInfo) {
                    const newProj = useProjectsStore.getState().startLevelChallenge(
                      nextInfo.nextLevel.id,
                      nextInfo.nextChallenge.id
                    );
                    window.location.href = `/projects/${newProj.id}/editor?level=${nextInfo.nextLevel.id}&challenge=${nextInfo.nextChallenge.id}`;
                  } else {
                    window.location.href = "/learn";
                  }
                }}
                className="py-2 px-4 bg-[#287A52] hover:bg-[#1E5F3F] text-white text-xs font-bold rounded uppercase flex items-center gap-1.5 border-none cursor-pointer shadow-xs transition-colors"
              >
                <span>Next Challenge</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-10 text-center rounded">
          <Code2 size={24} className="mx-auto mb-2 text-[#888]" />
          <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
            Open Canvas Project
          </h3>
          <p style={{ fontSize: 12, color: "#666666", marginBottom: 16 }}>
            This project has no active challenge attached. Add logic, loops, and math freely in the editor.
          </p>
          <Link
            href={`/projects/${project.id}/editor`}
            style={{
              padding: "7px 16px",
              background: "#F26A3D",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 4,
            }}
          >
            OPEN EDITOR →
          </Link>
        </div>
      )}
    </div>
  );
}
