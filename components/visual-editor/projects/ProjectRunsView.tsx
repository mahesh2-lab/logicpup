"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, Terminal, AlertTriangle } from "lucide-react";
import type { Project, ProjectRun } from "./types";
import { useMounted } from "@/lib/useMounted";

interface ProjectRunsViewProps {
  project: Project;
}

export function ProjectRunsView({ project }: ProjectRunsViewProps) {
  const mounted = useMounted();
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    project.runs[0]?.id || null
  );

  const activeRun = project.runs.find((r) => r.id === selectedRunId) || project.runs[0];

  function formatTime(iso: string) {
    if (!mounted) return "Recently";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "Recently";
    }
  }

  return (
    <div
      className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden max-w-6xl mx-auto w-full p-4 md:p-6 gap-4 md:gap-6"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      {/* Runs History Table Left Column */}
      <div
        className="w-full md:w-80 h-64 md:h-auto bg-[#FFFFFF] border border-[#D8D4CC] flex flex-col shrink-0 overflow-hidden"
        style={{ borderRadius: 6 }}
      >
        <div className="p-3 border-b border-[#E5E2DA] flex items-center justify-between">
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#171717" }}>
            RUN HISTORY ({project.runs.length})
          </span>
          <span className="text-[10px] font-mono text-[#888888]">LOGGED</span>
        </div>

        {project.runs.length > 0 ? (
          <div className="flex-1 overflow-auto divide-y divide-[#E5E2DA]">
            {project.runs.map((run) => {
              const isSelected = run.id === activeRun?.id;
              return (
                <div
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`p-3 cursor-pointer text-xs transition-colors ${
                    isSelected ? "bg-[#FFF8F5] border-l-4 border-l-[#F26A3D]" : "hover:bg-[#F4F1EA]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      {run.status === "success" ? (
                        <CheckCircle2 size={13} color="#287A52" />
                      ) : (
                        <XCircle size={13} color="#C94A45" />
                      )}
                      <span>RUN #{run.runNumber}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#888888]">
                      {run.durationMs}ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#666666] font-mono">
                    <span className="capitalize">{run.status}</span>
                    <span suppressHydrationWarning>{formatTime(run.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-[#888888]">
            <Terminal size={24} className="mb-2 text-[#D8D4CC]" />
            <p>No executions logged yet.</p>
            <p className="text-[11px] mt-1">Press "RUN →" in the editor to execute your program.</p>
          </div>
        )}
      </div>

      {/* Selected Run Details Inspector */}
      <div
        className="flex-1 min-h-100 md:min-h-0 bg-[#171717] text-[#FFFFFF] border border-[#D8D4CC] flex flex-col overflow-hidden shrink-0"
        style={{ borderRadius: 6 }}
      >
        {activeRun ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-11 border-b border-[#2B2B2B] bg-[#1F1F1F] font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold">RUN #{activeRun.runNumber} SNAPSHOT</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    activeRun.status === "success" ? "bg-[#287A52] text-white" : "bg-[#C94A45] text-white"
                  }`}
                >
                  {activeRun.status}
                </span>
              </div>
              <div className="text-[11px] text-[#888888]">
                Duration: {activeRun.durationMs}ms • {new Date(activeRun.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {/* Output & Environment */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden font-mono text-xs">
              {/* Stdout Console */}
              <div className="flex-1 p-4 overflow-auto leading-relaxed border-b sm:border-b-0 sm:border-r border-[#2B2B2B]">
                <div className="text-[#666666] mb-3">$ python main.py</div>

                {activeRun.output.map((line, i) => (
                  <div key={i} className="text-[#34D399]">
                    {line || <>&nbsp;</>}
                  </div>
                ))}

                {activeRun.error && (
                  <div className="mt-2 p-2 bg-[#C94A45]/20 border border-[#C94A45] text-[#F87171] rounded flex items-center gap-1.5">
                    <AlertTriangle size={13} />
                    <span>{activeRun.error}</span>
                  </div>
                )}
              </div>

              {/* State Variables at run completion */}
              <div className="w-full sm:w-56 p-4 bg-[#141414] overflow-auto shrink-0 min-h-37.5 sm:min-h-0">
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#888888",
                    marginBottom: 10,
                  }}
                >
                  VARIABLE DUMP
                </div>

                {Object.keys(activeRun.variables).length > 0 ? (
                  <div className="space-y-1.5">
                    {Object.entries(activeRun.variables)
                      .filter(([k]) => !k.startsWith("__"))
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-[#356A9A]">{k}</span>
                          <span className="text-[#AAAAAA] truncate max-w-25">
                            {String(v)}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-[#666666] italic text-[11px]">
                    No variables set.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#666666]">
            Select an execution run from the list.
          </div>
        )}
      </div>
    </div>
  );
}
