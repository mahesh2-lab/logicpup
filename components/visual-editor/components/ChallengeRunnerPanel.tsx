"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Play,
  Award,
  Send,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  Target,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Trophy,
  Compass,
  ListOrdered,
  BookOpen,
} from "lucide-react";
import { parseProgram } from "../ast/parser";
import { runProgram } from "../execution/runner";
import { useEditorStore } from "../state/editorStore";
import { useProjectsStore } from "../projects/projectStore";
import {
  CODING_LEVELS,
  getNextChallenge,
  getPrevChallenge,
  findChallengeById,
  getAllChallengesFlat,
} from "../learning/levelsData";
import type { Project, LevelChallenge, TestCase } from "../projects/types";

export interface TestCaseResult {
  testCaseId: string;
  name: string;
  passed: boolean;
  actualOutputs: string[];
  expectedOutputs: string[];
  inputsUsed: string[];
  error: string | null;
  durationMs: number;
}

interface ChallengeRunnerPanelProps {
  project?: Project;
  onClose?: () => void;
}

export function ChallengeRunnerPanel({ project, onClose }: ChallengeRunnerPanelProps) {
  const router = useRouter();
  const { nodes, edges, resetToBlankCanvas, loadProjectProgram } = useEditorStore();
  const {
    completedChallengeIds,
    completeChallenge,
    startLevelChallenge,
    switchProjectToChallenge,
  } = useProjectsStore();

  // Look up active challenge from project.learningState or fallback to level 1 challenge 1
  const projectChallengeId = project?.learningState?.challengeId;
  const projectLevelId = project?.learningState?.levelId;

  let activeChallenge: LevelChallenge | undefined = undefined;
  let activeLevelId = projectLevelId || "level-1";

  if (projectLevelId && projectChallengeId) {
    const lvl = CODING_LEVELS.find((l) => l.id === projectLevelId);
    activeChallenge = lvl?.challenges.find((c) => c.id === projectChallengeId);
  }

  if (!activeChallenge && projectChallengeId) {
    const found = findChallengeById(projectChallengeId);
    if (found) {
      activeChallenge = found.challenge;
      activeLevelId = found.level.id;
    }
  }

  if (!activeChallenge && project?.learningState?.currentChallenge) {
    activeChallenge = project.learningState.currentChallenge;
    activeLevelId = activeChallenge.levelId;
  }

  if (!activeChallenge) {
    activeChallenge = CODING_LEVELS[0].challenges[0];
    activeLevelId = CODING_LEVELS[0].id;
  }

  const currentLevel = CODING_LEVELS.find((l) => l.id === activeLevelId) || CODING_LEVELS[0];
  const challengeIndexInLevel = currentLevel.challenges.findIndex((c) => c.id === activeChallenge.id);

  const isCompleted = completedChallengeIds.includes(activeChallenge.id);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showChallengeSelector, setShowChallengeSelector] = useState(false);
  const [submitted, setSubmitted] = useState(isCompleted);

  // Compute next and previous challenge info
  const nextInfo = activeChallenge
    ? getNextChallenge(activeLevelId, activeChallenge.id)
    : null;
  const prevInfo = activeChallenge
    ? getPrevChallenge(activeLevelId, activeChallenge.id)
    : null;

  // Reset local state whenever activeChallenge changes
  useEffect(() => {
    setTestResults(null);
    setShowHint(false);
    setShowCelebration(false);
    setSubmitted(completedChallengeIds.includes(activeChallenge.id));
  }, [activeChallenge.id, completedChallengeIds]);

  // Navigate to target challenge
  function navigateToChallenge(targetLevelId: string, targetChallengeId: string) {
    setShowChallengeSelector(false);
    setShowCelebration(false);

    if (project?.id) {
      // In-place update within current project
      switchProjectToChallenge(project.id, targetLevelId, targetChallengeId);
      const lvl = CODING_LEVELS.find((l) => l.id === targetLevelId);
      const ch = lvl?.challenges.find((c) => c.id === targetChallengeId);
      if (ch) {
        const defaultStarterNodes = [
          {
            id: "start-1",
            type: "startBlock",
            position: { x: 260, y: 60 },
            data: { blockType: "start", label: "Start", category: "program", color: "#555555", icon: "Play", values: {} },
            deletable: false,
          },
          {
            id: "end-1",
            type: "endBlock",
            position: { x: 260, y: 260 },
            data: { blockType: "end", label: "End", category: "program", color: "#555555", icon: "Square", values: {} },
            deletable: false,
          },
        ];
        const defaultStarterEdges = [
          { id: "edge-start-end", source: "start-1", target: "end-1" },
        ];

        const starterNodes = ch.starterNodes && ch.starterNodes.length > 0
          ? JSON.parse(JSON.stringify(ch.starterNodes))
          : defaultStarterNodes;
        const starterEdges = ch.starterEdges && ch.starterEdges.length > 0
          ? JSON.parse(JSON.stringify(ch.starterEdges))
          : defaultStarterEdges;

        loadProjectProgram(project.id, starterNodes, starterEdges);
      }
    } else {
      // Start a new project for this challenge
      const newProj = startLevelChallenge(targetLevelId, targetChallengeId);
      router.push(`/projects/${newProj.id}/editor`);
    }
  }

  // Run automated test cases
  async function handleRunTests() {
    if (!activeChallenge) return;
    setIsRunningTests(true);
    setTestResults(null);

    const program = parseProgram(nodes, edges);
    const results: TestCaseResult[] = [];

    for (const tc of activeChallenge.testCases) {
      const startTime = performance.now();
      const inputQueue = [...(tc.inputs || ["0"])];

      try {
        const runRes = await runProgram(program.ast, async () => {
          const next = inputQueue.shift() || "0";
          return Promise.resolve(next);
        });

        const durationMs = Math.round(performance.now() - startTime);
        const actualOutputs = runRes.finalState.output;
        const outStr = actualOutputs.join(" ").toLowerCase();

        const passed =
          !runRes.finalState.error &&
          tc.expectedOutputs.some((exp) =>
            outStr.includes(exp.toLowerCase().trim())
          );

        results.push({
          testCaseId: tc.id,
          name: tc.name,
          passed,
          actualOutputs,
          expectedOutputs: tc.expectedOutputs,
          inputsUsed: tc.inputs || [],
          error: runRes.finalState.error,
          durationMs,
        });
      } catch (err: unknown) {
        const durationMs = Math.round(performance.now() - startTime);
        results.push({
          testCaseId: tc.id,
          name: tc.name,
          passed: false,
          actualOutputs: [],
          expectedOutputs: tc.expectedOutputs,
          inputsUsed: tc.inputs || [],
          error: err instanceof Error ? err.message : "Execution error",
          durationMs,
        });
      }
    }

    setTestResults(results);
    setIsRunningTests(false);
  }

  const allPassed =
    testResults &&
    testResults.length > 0 &&
    testResults.every((r) => r.passed);

  function handleSubmit() {
    if (!activeChallenge) return;
    completeChallenge(activeChallenge.id);
    setSubmitted(true);
    setShowCelebration(true);
  }

  function handleGoToNextChallenge() {
    setShowCelebration(false);
    if (!nextInfo) {
      router.push("/learn");
      return;
    }
    navigateToChallenge(nextInfo.nextLevel.id, nextInfo.nextChallenge.id);
  }

  function handleGoToPrevChallenge() {
    if (!prevInfo) return;
    navigateToChallenge(prevInfo.nextLevel.id, prevInfo.nextChallenge.id);
  }

  const allChallengesFlat = getAllChallengesFlat();

  return (
    <div
      className="w-80 bg-[#FFFFFF] border-l border-[#D8D4CC] flex flex-col h-full overflow-hidden text-xs relative"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      {/* Header */}
      <div className="p-3 bg-[#F4F1EA] border-b border-[#D8D4CC] flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <Target size={15} color="#F26A3D" />
          <span className="uppercase tracking-wider">Challenge</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold bg-[#FFFFFF] border border-[#D8D4CC] px-2 py-0.5 rounded text-[#F26A3D]">
            ⭐ {activeChallenge.points} pts
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-transparent border-none cursor-pointer text-[#888] hover:text-[#171717] p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Challenge Navigation Bar */}
      <div className="px-3 py-2 bg-[#FAF9F5] border-b border-[#E5E2DA] flex items-center justify-between gap-1">
        <button
          onClick={handleGoToPrevChallenge}
          disabled={!prevInfo}
          className="p-1 bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D8D4CC] rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[#555] hover:text-[#171717]"
          title={prevInfo ? `Previous: ${prevInfo.nextChallenge.title}` : "First challenge"}
        >
          <ChevronLeft size={13} />
        </button>

        {/* Level / Challenge Dropdown Trigger */}
        <button
          onClick={() => setShowChallengeSelector(!showChallengeSelector)}
          className="flex-1 px-2 py-1 bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D8D4CC] rounded flex items-center justify-between text-left cursor-pointer transition-colors shadow-2xs"
        >
          <div className="truncate font-bold text-[11px] text-[#171717] flex items-center gap-1">
            <span className="text-[#F26A3D]">L0{currentLevel.levelNumber}</span>
            <span className="text-[#999]">·</span>
            <span>Ch {challengeIndexInLevel + 1}/{currentLevel.challenges.length}</span>
            {isCompleted && <span className="text-[#287A52] text-[10px]">✓</span>}
          </div>
          <ChevronDown size={12} className="text-[#888] shrink-0" />
        </button>

        <button
          onClick={handleGoToNextChallenge}
          disabled={!nextInfo}
          className="p-1 bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D8D4CC] rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-[#555] hover:text-[#171717]"
          title={nextInfo ? `Next: ${nextInfo.nextChallenge.title}` : "All challenges completed"}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Challenge Selector Dropdown Menu */}
      {showChallengeSelector && (
        <div className="absolute top-[82px] left-2 right-2 z-40 bg-[#FFFFFF] border-2 border-[#171717] rounded-lg shadow-xl max-h-80 overflow-y-auto p-2 space-y-2 animate-in fade-in-50">
          <div className="flex items-center justify-between px-1 pb-1 border-b border-[#E5E2DA]">
            <span className="font-bold text-[11px] uppercase tracking-wider text-[#777]">
              Switch Challenge
            </span>
            <button
              onClick={() => setShowChallengeSelector(false)}
              className="bg-transparent border-none cursor-pointer text-[#888] hover:text-[#171717] p-0.5"
            >
              <X size={12} />
            </button>
          </div>

          <div className="space-y-1">
            {allChallengesFlat.map((item) => {
              const isItemActive = item.challenge.id === activeChallenge.id;
              const isItemDone = completedChallengeIds.includes(item.challenge.id);

              return (
                <button
                  key={item.challenge.id}
                  onClick={() => navigateToChallenge(item.levelId, item.challenge.id)}
                  className={`w-full p-2 text-left rounded flex items-center justify-between gap-2 border cursor-pointer transition-colors ${
                    isItemActive
                      ? "bg-[#F26A3D]/10 border-[#F26A3D] text-[#171717]"
                      : "bg-[#FFFFFF] hover:bg-[#FAF9F5] border-[#E5E2DA] text-[#444]"
                  }`}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#888]">
                      <span>L0{item.levelNumber} Ch {item.challengeIndex}</span>
                      <span>•</span>
                      <span>⭐ {item.challenge.points}p</span>
                    </div>
                    <div className="font-bold text-xs truncate text-[#171717]">
                      {item.challenge.title}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isItemDone ? (
                      <span className="text-[10px] font-bold text-[#287A52] bg-[#287A52]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Check size={10} strokeWidth={3} /> Solved
                      </span>
                    ) : isItemActive ? (
                      <span className="text-[10px] font-bold text-[#F26A3D] bg-[#F26A3D]/10 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Goal Card */}
        <div className="bg-[#FAF9F5] border border-[#E5E2DA] p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#171717]">
              🎯 {activeChallenge.title}
            </span>
            <button
              onClick={() => {
                if (confirm("Reset canvas to clean Start and End blocks?")) {
                  resetToBlankCanvas();
                }
              }}
              className="text-[10px] text-[#888] hover:text-[#F26A3D] flex items-center gap-1 bg-transparent border-none cursor-pointer"
              title="Clear canvas to empty Start and End blocks"
            >
              <RotateCcw size={10} />
              <span>Empty Canvas</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="text-[10px] font-mono text-[#555] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E5E2DA] inline-block uppercase">
              {activeChallenge.formatLabel}
            </div>
            {isCompleted && (
              <span className="text-[10px] font-bold bg-[#287A52] text-white px-2 py-0.5 rounded flex items-center gap-0.5">
                <Check size={10} strokeWidth={3} /> Solved
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#444] leading-relaxed">
            {activeChallenge.goal || activeChallenge.description}
          </p>
        </div>

        {/* Quick Hint */}
        <div className="border border-[#E5E2DA] rounded-lg overflow-hidden">
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-full px-2.5 py-1.5 bg-[#FFFFFF] hover:bg-[#FAF9F5] flex items-center justify-between text-left font-bold text-[11px] text-[#555] border-none cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <HelpCircle size={12} color="#EAB308" />
              <span>Hint</span>
            </div>
            <ChevronRight
              size={12}
              className={`transition-transform ${showHint ? "rotate-90" : ""}`}
            />
          </button>
          {showHint && (
            <div className="p-2.5 bg-[#FFFDF5] border-t border-[#E5E2DA] text-[11px] text-[#666] leading-relaxed">
              💡 {activeChallenge.hint}
            </div>
          )}
        </div>

        {/* Checks */}
        <div className="space-y-1.5">
          <div className="font-bold text-[11px] uppercase tracking-wider text-[#888]">
            Checks ({activeChallenge.testCases.length})
          </div>

          <div className="space-y-1.5">
            {activeChallenge.testCases.map((tc) => {
              const res = testResults?.find((r) => r.testCaseId === tc.id);
              return (
                <div
                  key={tc.id}
                  className={`p-2 border rounded-md transition-colors ${
                    res
                      ? res.passed
                        ? "bg-[#F7FDF9] border-[#287A52]"
                        : "bg-[#FFF8F8] border-[#C94A45]"
                      : "bg-[#FFFFFF] border-[#E5E2DA]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#171717]">
                      {tc.name}
                    </span>
                    {res ? (
                      res.passed ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#287A52]">
                          <Check size={11} strokeWidth={3} /> Pass
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#C94A45]">
                          <X size={11} strokeWidth={3} /> Try again
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] text-[#999]">Ready</span>
                    )}
                  </div>

                  <div className="text-[10px] text-[#666] mt-1">
                    Expects: <strong className="text-[#287A52]">&quot;{tc.expectedOutputs[0]}&quot;</strong>
                  </div>

                  {res && !res.passed && (
                    <div className="text-[10px] text-[#C94A45] mt-1 pt-1 border-t border-[#E5E2DA]">
                      Printed: {res.actualOutputs.length > 0 ? `"${res.actualOutputs.join('", "')}"` : "(nothing)"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-2 bg-[#F4F1EA] border-t border-[#D8D4CC] flex items-center gap-2">
        <button
          onClick={handleRunTests}
          disabled={isRunningTests}
          className="flex-1 py-1.5 px-2.5 bg-[#FFFFFF] hover:bg-[#FAF9F5] border border-[#D8D4CC] text-[#171717] text-[11px] font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
          title="Run test checks"
        >
          {isRunningTests ? (
            <RefreshCw size={11} className="animate-spin text-[#888]" />
          ) : (
            <Play size={10} fill="currentColor" className="text-[#171717]" />
          )}
          <span>{isRunningTests ? "Checking…" : "Test Code"}</span>
        </button>

        {submitted ? (
          <button
            onClick={handleGoToNextChallenge}
            className="flex-1 py-1.5 px-2.5 bg-[#287A52] hover:bg-[#1E5F3F] text-white text-[11px] font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer border border-[#287A52] transition-colors shadow-xs"
            title={nextInfo ? `Next: ${nextInfo.nextChallenge.title}` : "View All Levels"}
          >
            <span>{nextInfo ? "Next Challenge" : "All Levels"}</span>
            <ArrowRight size={11} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allPassed}
            className={`flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer border transition-colors shadow-xs ${
              allPassed
                ? "bg-[#F26A3D] border-[#F26A3D] text-white hover:bg-[#E0592C]"
                : "bg-[#EFECE6] border-[#D8D4CC] text-[#888888] cursor-not-allowed"
            }`}
          >
            <Send size={10} />
            <span>Submit</span>
          </button>
        )}
      </div>

      {/* Celebration Modal with Next Challenge Redirection */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#171717] rounded-xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-[#287A52]/15 text-[#287A52] rounded-full flex items-center justify-center mx-auto text-3xl">
              <Award size={32} />
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-[#287A52] tracking-wider mb-1">
                CHALLENGE COMPLETED
              </div>
              <h2 className="text-lg font-bold text-[#171717]">
                🎉 {activeChallenge.title}
              </h2>
              <p className="text-xs text-[#555] mt-1.5">
                You earned <strong className="text-[#F26A3D]">+{activeChallenge.points} Points ⭐</strong>!
              </p>
            </div>

            {/* Next Challenge Info Card */}
            {nextInfo ? (
              <div className="p-3.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded-lg text-left space-y-2">
                {nextInfo.isNextLevel && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#287A52] bg-[#287A52]/10 px-2 py-0.5 rounded uppercase">
                    <Trophy size={12} />
                    <span>Level {nextInfo.nextLevel.levelNumber} Unlocked!</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase bg-[#EFECE6] px-1.5 py-0.5 rounded text-[#666]">
                    NEXT: LEVEL {nextInfo.nextLevel.levelNumber}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#F26A3D]">
                    ⭐ {nextInfo.nextChallenge.points} PTS
                  </span>
                </div>

                <div className="text-xs font-bold text-[#171717]">
                  {nextInfo.nextChallenge.title}
                </div>
                <p className="text-[11px] text-[#666] line-clamp-2">
                  {nextInfo.nextChallenge.goal || nextInfo.nextChallenge.description}
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-[#F7FDF9] border border-[#287A52] rounded-lg text-xs text-[#287A52] font-semibold flex items-center justify-center gap-2">
                <Sparkles size={16} />
                <span>🎓 Congratulations! You completed all 10 Levels!</span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={handleGoToNextChallenge}
                className="w-full py-2.5 px-4 bg-[#F26A3D] hover:bg-[#E0592C] text-white font-bold text-xs rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 border-none cursor-pointer shadow-sm transition-colors"
              >
                <span>{nextInfo ? "Start Next Challenge" : "View All Levels"}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-1.5 text-[11px] font-semibold text-[#777] hover:text-[#171717] bg-transparent border-none cursor-pointer"
              >
                Stay on current canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

