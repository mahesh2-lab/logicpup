"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Sparkles } from "lucide-react";
import { useEditorStore } from "@/components/visual-editor/state/editorStore";
import {
  BLOCK_MAP,
  CATEGORY_META,
  getBlockExplanation,
  type BlockExplanation,
} from "@/components/visual-editor/blocks/definitions";
import { IconRenderer } from "./IconRenderer";

export function BlockExplanationModal() {
  const { helpBlockType, closeHelp } = useEditorStore();
  const [selectedLang, setSelectedLang] = useState<"python" | "javascript">("python");
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeHelp();
      }
    }
    if (helpBlockType) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [helpBlockType, closeHelp]);

  if (!helpBlockType) return null;

  const def = BLOCK_MAP.get(helpBlockType);
  const explanation: BlockExplanation = getBlockExplanation(helpBlockType);
  const meta = def ? CATEGORY_META[def.category] : { label: "Block", color: "#F26A3D", icon: "Code" };
  const catColor = meta?.color ?? "#171717";

  const codeSnippet = selectedLang === "python" ? explanation.python : explanation.javascript;

  function handleCopy() {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-100"
      onClick={closeHelp}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#D8D4CC] shadow-xl rounded overflow-hidden flex flex-col animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E2DA] bg-[#FAF9F5]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded flex items-center justify-center bg-white border border-[#D8D4CC]"
              style={{ color: catColor }}
            >
              <IconRenderer name={def?.icon || "Code"} size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#171717]">
                  {def?.label || helpBlockType}
                </h3>
                <span
                  className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border"
                  style={{
                    color: catColor,
                    borderColor: `${catColor}35`,
                    backgroundColor: `${catColor}12`,
                  }}
                >
                  {meta?.label || def?.category || "BLOCK"}
                </span>
              </div>
              <p className="text-[11px] text-[#777777] mt-0.5">
                How this block works in real code
              </p>
            </div>
          </div>

          <button
            onClick={closeHelp}
            className="p-1.5 text-[#888888] hover:text-[#171717] rounded hover:bg-[#E5E2DA] transition-colors border-none bg-transparent cursor-pointer"
            title="Close (Esc)"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs leading-relaxed text-[#333333]">
          {/* Plain, Friendly Kid Explanation */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E5E2DA] rounded">
            <p className="text-sm text-[#171717] font-semibold leading-snug m-0">
              {explanation.simple}
            </p>
          </div>

          {/* How it works & Words to know */}
          <div className="space-y-2">
            <p className="text-xs text-[#555555] m-0">
              {explanation.programming}
            </p>

            {explanation.terminology && explanation.terminology.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-[#888888] uppercase mr-1">
                  Words to know:
                </span>
                {explanation.terminology.map((term) => (
                  <span
                    key={term}
                    className="px-2 py-0.5 bg-[#FAF9F5] border border-[#D8D4CC] text-[#333333] rounded text-[11px] font-medium"
                  >
                    {term}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Real Code Syntax */}
          <div className="pt-3 border-t border-[#E5E2DA]">
            <div className="flex items-center justify-between mb-2">
              {/* Language Switcher Tabs */}
              <div className="flex items-center bg-[#FAF9F5] border border-[#D8D4CC] rounded p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedLang("python")}
                  className={`px-3 py-1 rounded cursor-pointer border-none font-bold transition-colors ${
                    selectedLang === "python"
                      ? "bg-[#171717] text-white"
                      : "bg-transparent text-[#666666] hover:text-[#171717]"
                  }`}
                >
                  🐍 Python
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang("javascript")}
                  className={`px-3 py-1 rounded cursor-pointer border-none font-bold transition-colors ${
                    selectedLang === "javascript"
                      ? "bg-[#171717] text-white"
                      : "bg-transparent text-[#666666] hover:text-[#171717]"
                  }`}
                >
                  ⚡ JavaScript
                </button>
              </div>

              {/* Copy Action */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[11px] font-mono text-[#666666] hover:text-[#171717] bg-[#FAF9F5] hover:bg-white border border-[#D8D4CC] px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-[#287A52]" />
                    <span className="text-[#287A52] font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Snippet Box */}
            <pre className="p-3.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded font-mono text-xs text-[#171717] overflow-x-auto whitespace-pre leading-relaxed m-0">
              <code>{codeSnippet}</code>
            </pre>
          </div>

          {/* Why It Matters / In Games */}
          {explanation.whyItMatters && (
            <div className="p-2.5 bg-[#FFF9E6] border border-[#FFEBAA] rounded flex items-start gap-2 text-xs">
              <Sparkles size={14} className="text-[#F26A3D] shrink-0 mt-0.5" />
              <p className="m-0 text-[11px] text-[#78350F] leading-snug">
                <strong className="text-[#92400E]">In Games & Apps:</strong> {explanation.whyItMatters}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E2DA] bg-[#FAF9F5]">
          <span className="text-[11px] text-[#888888]">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-[#D8D4CC] rounded text-[10px] font-mono">Esc</kbd> to return to coding
          </span>
          <button
            type="button"
            onClick={closeHelp}
            className="px-4 py-2 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold uppercase rounded border-none cursor-pointer transition-colors shadow-xs"
          >
            Got It! 
          </button>
        </div>
      </div>
    </div>
  );
}
