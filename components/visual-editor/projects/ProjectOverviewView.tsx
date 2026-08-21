"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Terminal, Play, Sparkles } from "lucide-react";
import type { Project } from "./types";
import { useMounted } from "@/lib/useMounted";

interface ProjectOverviewViewProps {
  project: Project;
}

export function ProjectOverviewView({ project }: ProjectOverviewViewProps) {
  const mounted = useMounted();

  function formatTime(iso: string) {
    if (!mounted) return "Recently";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Recently";
    }
  }

  return (
    <div
      className="flex-1 overflow-auto p-8 max-w-5xl mx-auto w-full"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      {/* Project Hero Banner */}
      <div
        className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 mb-6 shadow-sm"
        style={{ borderRadius: 6 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E5E2DA]">
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#555555",
                marginBottom: 2,
              }}
            >
              PROJECT OVERVIEW
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {project.name}
            </h1>
            <p style={{ fontSize: 13, color: "#555555", marginTop: 4 }}>
              {project.description ||
                "Python visual programming project built with LogicPup. 🐾"}
            </p>
          </div>

          <Link
            href={`/projects/${project.id}/editor`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "#F26A3D",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 4,
            }}
            className="w-full md:w-auto justify-center"
          >
            OPEN EDITOR <ArrowRight size={13} />
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="border border-[#E5E2DA] p-3 bg-[#FBFCFF]">
            <div className="text-[#888888] font-mono text-[10px] uppercase">
              LANGUAGE
            </div>
            <div className="font-bold text-sm text-[#171717] mt-1 capitalize truncate">
              {project.language}
            </div>
          </div>
          <div className="border border-[#E5E2DA] p-3 bg-[#FBFCFF]">
            <div className="text-[#888888] font-mono text-[10px] uppercase">
              VISUAL BLOCKS
            </div>
            <div className="font-bold text-sm text-[#171717] mt-1 truncate">
              {project.visualProgram.nodes.length} Blocks
            </div>
          </div>
          <div className="border border-[#E5E2DA] p-3 bg-[#FBFCFF] col-span-2 sm:col-span-1">
            <div className="text-[#888888] font-mono text-[10px] uppercase">
              TOTAL RUNS
            </div>
            <div className="font-bold text-sm text-[#171717] mt-1 truncate">
              {project.runs.length} Executions
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Workspace Actions & Details */}
        <div className="col-span-2 space-y-6">
          <div
            className="bg-[#FFFFFF] border border-[#D8D4CC] p-5"
            style={{ borderRadius: 6 }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA] mb-3">
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#171717",
                }}
              >
                WORKSPACE QUICK ACTIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/projects/${project.id}/editor`}
                className="p-4 border border-[#E5E2DA] bg-[#FBFCFF] hover:border-[#F26A3D] transition-colors rounded block no-underline"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-[#171717] mb-1">
                  <Code2 size={15} className="text-[#F26A3D]" />
                  <span>Visual Flow Editor</span>
                </div>
                <p className="text-[11px] text-[#666666] leading-relaxed">
                  Construct your program with drag-and-drop logic blocks and
                  real-time Python generation.
                </p>
              </Link>

              <Link
                href={`/projects/${project.id}/runs`}
                className="p-4 border border-[#E5E2DA] bg-[#FBFCFF] hover:border-[#F26A3D] transition-colors rounded block no-underline"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-[#171717] mb-1">
                  <Terminal size={15} className="text-[#287A52]" />
                  <span>Run History & Output</span>
                </div>
                <p className="text-[11px] text-[#666666] leading-relaxed">
                  Review execution logs, runtime durations, and variable state
                  snapshots.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activity Timeline */}
        <div>
          <div
            className="bg-[#FFFFFF] border border-[#D8D4CC] p-5"
            style={{ borderRadius: 6 }}
          >
            <div className="pb-3 border-b border-[#E5E2DA] mb-3">
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#171717",
                }}
              >
                RECENT ACTIVITY
              </span>
            </div>

            {project.activity.length > 0 ? (
              <div className="space-y-3">
                {project.activity.slice(0, 8).map((act) => (
                  <div
                    key={act.id}
                    className="text-xs border-l-2 border-[#F26A3D] pl-3 py-0.5"
                  >
                    <div className="text-[#171717] font-medium">
                      {act.description}
                    </div>
                    <div
                      suppressHydrationWarning
                      className="text-[10px] text-[#888888] font-mono mt-0.5"
                    >
                      {formatTime(act.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#888888] italic py-2">
                No activity recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
