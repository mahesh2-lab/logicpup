"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  Play,
  Award,
  Send,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  Target,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { parseProgram } from "../ast/parser";
import { runProgram } from "../execution/runner";
import { useEditorStore } from "../state/editorStore";
import { useProjectsStore } from "../projects/projectStore";
import { CODING_LEVELS } from "../learning/levelsData";
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
  const { nodes, edges, resetToBlankCanvas } = useEditorStore();
  const {
    completedChallengeIds,
    completeChallenge,
  } = useProjectsStore();

  // Look up active challenge from project.learningState or fallback to level 1 challenge 1
  const projectChallengeId = project?.learningState?.challengeId;
  const projectLevelId = project?.learningState?.levelId;

  let activeChallenge: LevelChallenge | undefined = undefined;
  if (projectLevelId && projectChallengeId) {
    const lvl = CODING_LEVELS.find((l) => l.id === projectLevelId);
    activeChallenge = lvl?.challenges.find((c) => c.id === projectChallengeId);
  }

  if (!activeChallenge && project?.learningState?.currentChallenge) {
    activeChallenge = project.learningState.currentChallenge;
  }

  if (!activeChallenge) {
    // Default fallback
    activeChallenge = CODING_LEVELS[0].challenges[0];
  }

  const isCompleted = completedChallengeIds.includes(activeChallenge.id);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [submitted, setSubmitted] = useState(isCompleted);

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

  return (
    <div
      className="w-72 bg-[#FFFFFF] border-l border-[#D8D4CC] flex flex-col h-full overflow-hidden text-xs"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      {/* Header */}
      <div className="p-3 bg-[#F4F1EA] border-b border-[#D8D4CC] flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <Target size={15} color="#F26A3D" />
          <span className="uppercase">Challenge</span>
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

          <div className="text-[10px] font-mono text-[#555] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E5E2DA] inline-block uppercase">
            {activeChallenge.formatLabel}
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

        <button
          onClick={handleSubmit}
          disabled={submitted || !allPassed}
          className={`flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer border transition-colors shadow-xs ${
            submitted
              ? "bg-[#287A52] border-[#287A52] text-white cursor-default"
              : allPassed
              ? "bg-[#F26A3D] border-[#F26A3D] text-white hover:bg-[#E0592C]"
              : "bg-[#EFECE6] border-[#D8D4CC] text-[#888888] cursor-not-allowed"
          }`}
        >
          {submitted ? (
            <>
              <Check size={11} strokeWidth={3} />
              <span>Solved</span>
            </>
          ) : (
            <>
              <Send size={10} />
              <span>Submit</span>
            </>
          )}
        </button>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#171717] rounded-xl shadow-2xl p-5 max-w-xs w-full text-center space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-[#287A52]/15 text-[#287A52] rounded-full flex items-center justify-center mx-auto text-2xl">
              <Award size={28} />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#171717]">
                🎉 Challenge Solved!
              </h2>
              <p className="text-xs text-[#555] mt-1">
                You earned <strong className="text-[#F26A3D]">+{activeChallenge.points} Points ⭐</strong>!
              </p>
            </div>

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-2 bg-[#F26A3D] hover:bg-[#E0592C] text-white font-bold text-xs rounded-lg uppercase border-none cursor-pointer"
            >
              Continue 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
