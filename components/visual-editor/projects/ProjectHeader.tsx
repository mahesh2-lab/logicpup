"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Save, Square, Check, Edit2, BookOpen, WifiOff, RotateCcw, CheckCircle2, Pause, Play } from "lucide-react";
import { useProjectsStore } from "./projectStore";
import { useEditorStore } from "../state/editorStore";
import { parseProgram } from "../ast/parser";
import { runProgram } from "../execution/runner";
import { UserAuthMenu } from "../components/UserAuthMenu";
import type { Project } from "./types";
import { useMounted } from "@/lib/useMounted";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const {
    updateProject,
    saveStatus,
    recordRun,
    syncState,
    offlineQueue,
    isOnline,
    setOnlineStatus,
  } = useProjectsStore();
  const {
    nodes,
    edges,
    execution,
    setExecution,
    setInputPrompt,
    taskPanelOpen,
    setTaskPanelOpen,
  } = useEditorStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(project.name);

  React.useEffect(() => {
    setTitleValue(project.name);
  }, [project.name]);

  const isRunning = execution.status === "running";

  const tabs = [
    { id: "overview", label: "OVERVIEW", href: `/projects/${project.id}/overview` },
    { id: "editor",   label: "EDITOR",   href: `/projects/${project.id}/editor` },
    { id: "runs",     label: "RUNS",     href: `/projects/${project.id}/runs` },
    { id: "settings", label: "SETTINGS", href: `/projects/${project.id}/settings` },
  ];

  function handleSaveTitle() {
    if (titleValue.trim()) {
      updateProject(project.id, { name: titleValue.trim() });
    }
    setIsEditingTitle(false);
  }

  async function handleRun() {
    setExecution({
      status: "running",
      output: [],
      variables: {},
      executingNodeId: null,
      executedNodeIds: [],
      error: null,
    });
    const startTime = performance.now();

    try {
      const program = parseProgram(nodes, edges);
      const result = await runProgram(
        program.ast,
        (nodeId, promptText, variableName) => {
          setExecution({
            status: "running",
            output: useEditorStore.getState().execution.output,
            variables: useEditorStore.getState().execution.variables,
            executingNodeId: nodeId,
            executedNodeIds: useEditorStore.getState().execution.executedNodeIds,
            error: null,
          });

          return new Promise<string>((resolve) => {
            setInputPrompt({
              nodeId,
              promptText,
              variableName,
              resolve,
            });
          });
        }
      );

      let stepIdx = 0;
      const totalSteps = result.steps.length;

      function nextStep() {
        if (stepIdx >= totalSteps) {
          const duration = Math.round(performance.now() - startTime);
          setExecution(result.finalState);

          // Record run into project history
          if (project?.id) {
            recordRun(project.id, {
              status: result.finalState.error ? "error" : "success",
              durationMs: duration,
              output: result.finalState.output,
              variables: result.finalState.variables,
              error: result.finalState.error,
            });
          }
          return;
        }
        const step = result.steps[stepIdx++];
        setExecution({
          status: "running",
          output: result.finalState.output.slice(0, stepIdx),
          variables: step.variables,
          executingNodeId: step.nodeId ?? null,
          executedNodeIds: result.finalState.executedNodeIds.slice(0, stepIdx),
          error: null,
        });
        setTimeout(nextStep, 90);
      }
      setTimeout(nextStep, 40);
    } catch (e) {
      const duration = Math.round(performance.now() - startTime);
      const errMsg = e instanceof Error ? e.message : "Execution failed";
      setExecution({
        status: "error",
        output: [],
        variables: {},
        executingNodeId: null,
        executedNodeIds: [],
        error: errMsg,
      });
      if (project?.id) {
        recordRun(project.id, {
          status: "error",
          durationMs: duration,
          output: [],
          variables: {},
          error: errMsg,
        });
      }
    }
  }

  function handleStop() {
    setInputPrompt(null);
    setExecution({
      status: "idle",
      output: [],
      variables: {},
      executingNodeId: null,
      executedNodeIds: [],
      error: null,
    });
  }

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-3 md:py-0 md:h-[50px] border-b border-[#D8D4CC] bg-[#F4F1EA] shrink-0 z-30 font-sans gap-3 md:gap-0">
      {/* Left: Back Link + Project Title */}
      <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto min-w-0">
        <Link
          href="/dashboard"
          className="p-1.5 -ml-1.5 rounded-sm hover:bg-black/[0.04] text-[#888888] hover:text-[#171717] transition-colors flex items-center justify-center shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="pr-3 border-r border-[#D8D4CC] shrink-0 hidden sm:block">
          <BrandLogo size="sm" href="/dashboard" />
        </div>

        {/* Project Name (Editable) */}
        {isEditingTitle ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              autoFocus
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#171717",
                background: "#FFFFFF",
                border: "1px solid #F26A3D",
                borderRadius: 3,
                padding: "2px 6px",
                outline: "none",
                textTransform: "uppercase",
              }}
            />
            <button
              onClick={handleSaveTitle}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#287A52" }}
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-1.5 cursor-pointer min-w-0 truncate"
            title="Click to rename"
          >
            <span className="text-[13px] font-bold tracking-[0.02em] uppercase text-[#171717] truncate">
              {project.name}
            </span>
            <Edit2 size={11} color="#888888" className="shrink-0" />
          </div>
        )}

        {/* <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#555555",
            background: "#FFFFFF",
            border: "1px solid #D8D4CC",
            borderRadius: 3,
            padding: "1px 5px",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}
        >
          {project.language}
        </span> */}
      </div>

      {/* Center: Navigation Sub-tabs */}
      <nav className="flex items-center gap-1 md:gap-2 w-full md:w-auto overflow-x-auto no-scrollbar border-b border-[#D8D4CC] md:border-none pb-1 md:pb-0">
        {tabs.map((t) => {
          const isActive = pathname.endsWith(t.id);
          return (
            <Link
              key={t.id}
              href={t.href}
              style={{
                padding: "6px 10px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive ? "#171717" : "#666666",
                background: isActive ? "#FFFFFF" : "transparent",
                borderBottom: isActive ? "2px solid #F26A3D" : "2px solid transparent",
                borderRadius: "3px 3px 0 0",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Autosave Status & Command Buttons */}
      <div className="flex items-center justify-between md:justify-end gap-2 md:gap-[10px] w-full md:w-auto flex-wrap">
        {/* Offline & Sync Status Badge */}
        {mounted && (
          syncState === "offline" || !isOnline ? (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FFF3CD] border border-[#FFEBAA] text-[#856404] text-[9px] font-mono font-bold rounded"
              title={`${offlineQueue.length} offline changes queued`}
            >
              <WifiOff size={10} />
              <span>OFFLINE ({offlineQueue.length})</span>
            </div>
          ) : syncState === "syncing" ? (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 bg-[#E8F4FD] border border-[#BEE5EB] text-[#0C5460] text-[9px] font-mono font-bold rounded"
              title="Syncing pending changes to cloud database..."
            >
              <RotateCcw size={10} className="animate-spin" />
              <span>SYNCING…</span>
            </div>
          ) : null
        )}

        {/* Autosave badge */}
        {mounted && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: "var(--font-mono)", color: "#888888" }}>
            {saveStatus === "saved" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#287A52]" />
                <span>SAVED</span>
              </>
            )}
            {saveStatus === "saving" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F26A3D] animate-pulse" />
                <span>SAVING…</span>
              </>
            )}
            {saveStatus === "unsaved" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C94A45]" />
                <span>UNSAVED</span>
              </>
            )}
          </div>
        )}

        {/* Challenge & Test Cases Toggle */}
        <button
          onClick={() => setTaskPanelOpen(!taskPanelOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            background: taskPanelOpen ? "#171717" : "#FFFFFF",
            color: taskPanelOpen ? "#FFFFFF" : "#171717",
            border: "1px solid #D8D4CC",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
          title="Toggle Challenge & Test Cases panel"
        >
          <BookOpen size={12} color={taskPanelOpen ? "#F26A3D" : "#555"} />
          <span>CHALLENGE & TESTS</span>
        </button>

        {/* Run Button */}
        {!isRunning ? (
          <button
            onClick={handleRun}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#F26A3D",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              transition: "background 100ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E0592C")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F26A3D")}
            title="Execute current program"
          >
            RUN 
            <span>
              <Play size={12}/>
            </span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: "#C94A45",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
            }}
            title="Stop execution"
          >
            <Square size={11} fill="currentColor" /> STOP
          </button>
        )}

        <div className="w-[1px] h-4 bg-[#D8D4CC] hidden md:block" />
        <div className="hidden md:block">
          <UserAuthMenu />
        </div>
      </div>
    </header>
  );
}
