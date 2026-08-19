"use client";

import React, { useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useEditorStore } from "../state/editorStore";

// ─────────────────────────────────────────────────────────────────────────────
// Output Panel — Editorial Developer Terminal
// ─────────────────────────────────────────────────────────────────────────────

interface OutputPanelProps {
  expanded: boolean;
  onToggle: () => void;
}

export function OutputPanel({ expanded, onToggle }: OutputPanelProps) {
  const { execution, setExecution } = useEditorStore();
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) {
      outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [execution.output, expanded]);

  const hasOutput = execution.output.length > 0;
  const hasVars = Object.keys(execution.variables).filter((k) => !k.startsWith("__")).length > 0;

  function clearOutput() {
    setExecution({
      ...execution,
      status: "idle",
      output: [],
      error: null,
      variables: {},
    });
  }

  return (
    <div
      className="flex flex-col border-t border-[#D8D4CC] bg-[#171717] text-[#FFFFFF] shrink-0 transition-all duration-150"
      style={{ height: expanded ? 180 : 36 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-9 bg-[#171717] border-b border-[#2B2B2B] shrink-0 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            OUTPUT
          </span>

          {execution.status === "finished" && (
            <span style={{ fontSize: 10, color: "#287A52", fontWeight: 600 }}>
              ● Process completed
            </span>
          )}
          {execution.status === "running" && (
            <span style={{ fontSize: 10, color: "#F26A3D", fontWeight: 600 }}>
              ● Executing…
            </span>
          )}
          {execution.status === "error" && (
            <span style={{ fontSize: 10, color: "#C94A45", fontWeight: 600 }}>
              ● Error encountered
            </span>
          )}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={clearOutput}
            title="Clear output"
            className="text-[#888888] hover:text-[#FFFFFF] p-1 rounded transition-colors"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={onToggle}
            title={expanded ? "Collapse panel" : "Expand panel"}
            className="text-[#888888] hover:text-[#FFFFFF] p-1 rounded transition-colors"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {expanded && (
        <div className="flex flex-1 overflow-hidden font-mono text-xs">
          {/* Main Stdout */}
          <div className="flex-1 overflow-auto p-3 text-[#E0E0E0] leading-relaxed">
            <div className="text-[#666666] mb-2 select-none">
              $ python main.py
            </div>

            {!hasOutput && execution.status === "idle" && (
              <div className="text-[#666666] italic">
                Program ready. Click "RUN →" above to execute.
              </div>
            )}

            {execution.error && (
              <div className="text-[#C94A45] mb-2 p-2 bg-[#C94A45]/10 border border-[#C94A45]/30 rounded">
                Error: {execution.error}
              </div>
            )}

            {execution.output.map((line, i) => (
              <div key={i} className="text-[#FFFFFF]">
                {line || <>&nbsp;</>}
              </div>
            ))}
            <div ref={outputEndRef} />
          </div>

          {/* Variables Inspector */}
          {hasVars && (
            <div className="w-56 shrink-0 border-l border-[#2B2B2B] bg-[#141414] p-3 overflow-auto">
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#888888",
                  marginBottom: 8,
                }}
              >
                ENVIRONMENT STATE
              </div>
              <div className="space-y-1.5">
                {Object.entries(execution.variables)
                  .filter(([k]) => !k.startsWith("__"))
                  .map(([key, val]) => (
                    <div key={key} className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-[#356A9A] font-medium">{key}</span>
                      <span className="text-[#AAAAAA] truncate max-w-30">
                        {formatValue(val)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (Array.isArray(v)) return `[${v.map(formatValue).join(", ")}]`;
  return String(v);
}
