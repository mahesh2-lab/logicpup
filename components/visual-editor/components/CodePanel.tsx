"use client";

import React, { useState, useMemo } from "react";
import { Copy, Download, Check, ChevronRight, X } from "lucide-react";
import { useEditorStore } from "../state/editorStore";

// ─────────────────────────────────────────────────────────────────────────────
// Simple synchronous Python highlighter — no async Prism import needed
// ─────────────────────────────────────────────────────────────────────────────

const PY_KEYWORDS = new Set([
  "if", "else", "elif", "while", "for", "in", "not", "and", "or",
  "def", "return", "import", "from", "class", "pass", "break", "continue",
  "True", "False", "None", "try", "except", "finally", "with", "as",
  "lambda", "yield", "raise", "del", "assert", "global", "nonlocal",
]);

const PY_BUILTINS = new Set([
  "print", "input", "int", "float", "str", "bool", "len", "range",
  "list", "dict", "set", "tuple", "append", "type", "abs", "max", "min",
  "sum", "sorted", "reversed", "enumerate", "zip", "map", "filter",
  "random", "randint", "math",
]);

interface Token { kind: "kw" | "fn" | "str" | "num" | "comment" | "op" | "plain"; text: string }

function tokenizePythonLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Comment
    if (line[i] === "#") {
      tokens.push({ kind: "comment", text: line.slice(i) });
      break;
    }

    // String literal
    if (line[i] === '"' || line[i] === "'") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== q) {
        if (line[j] === "\\") j++;
        j++;
      }
      j++;
      tokens.push({ kind: "str", text: line.slice(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push({ kind: "num", text: line.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier / keyword
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (PY_KEYWORDS.has(word)) {
        tokens.push({ kind: "kw", text: word });
      } else if (PY_BUILTINS.has(word)) {
        tokens.push({ kind: "fn", text: word });
      } else {
        tokens.push({ kind: "plain", text: word });
      }
      i = j;
      continue;
    }

    // Operator / punctuation
    if (/[+\-*\/=<>!&|()[\]{},.:@%^~]/.test(line[i])) {
      let j = i + 1;
      while (j < line.length && /[+\-*\/=<>!&|]/.test(line[j])) j++;
      tokens.push({ kind: "op", text: line.slice(i, j) });
      i = j;
      continue;
    }

    // whitespace / other
    let j = i;
    while (j < line.length && !/[a-zA-Z0-9_"'#0-9+\-*\/=<>!&|()[\]{},.:@%^~]/.test(line[j])) j++;
    if (j === i) j++;
    tokens.push({ kind: "plain", text: line.slice(i, j) });
    i = j;
  }

  return tokens;
}

const TOKEN_COLORS: Record<Token["kind"], string> = {
  kw:      "#356A9A",  // blue
  fn:      "#806A55",  // brown
  str:     "#287A52",  // green
  num:     "#C94A45",  // red
  comment: "#aaa9a4",  // muted
  op:      "#555555",  // secondary ink
  plain:   "#171717",  // ink
};

function HighlightedLine({ code }: { code: string }) {
  const tokens = useMemo(() => tokenizePythonLine(code), [code]);
  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[tok.kind], fontStyle: tok.kind === "comment" ? "italic" : "normal" }}>
          {tok.text}
        </span>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Code Panel
// ─────────────────────────────────────────────────────────────────────────────

interface CodePanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CodePanel({ collapsed, onToggle }: CodePanelProps) {
  const { generatedCode, selectedNodeId, nodeLineMap } = useEditorStore();
  const [copied, setCopied] = useState(false);

  const highlightLine = selectedNodeId ? (nodeLineMap.get(selectedNodeId) ?? null) : null;
  const lines = generatedCode ? generatedCode.split("\n") : [];

  async function handleCopy() {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "program.py";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (collapsed) {
    return (
      <div
        style={{
          width: 32,
          flexShrink: 0,
          borderLeft: "1px solid #D8D4CC",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 12,
        }}
      >
        <button
          onClick={onToggle}
          title="Expand code panel"
          style={{ color: "#555", background: "none", border: "none", cursor: "pointer" }}
        >
          <ChevronRight size={14} />
        </button>
        <span
          style={{
            writingMode: "vertical-rl",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#aaa9a4",
            marginTop: 8,
          }}
        >
          Python
        </span>
      </div>
    );
  }

  return (
    <aside
      style={{
        width: 300,
        flexShrink: 0,
        borderLeft: "1px solid #D8D4CC",
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          height: 36,
          borderBottom: "1px solid #D8D4CC",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#171717" }}>
            Code
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PanelBtn onClick={handleCopy} title="Copy">
            {copied ? <Check size={12} color="#287A52" /> : <Copy size={12} />}
          </PanelBtn>
          <PanelBtn onClick={handleDownload} title="Download .py">
            <Download size={12} />
          </PanelBtn>
          <PanelBtn onClick={onToggle} title="Collapse">
            <ChevronRight size={12} />
          </PanelBtn>
        </div>
      </div>

      {/* Active line indicator */}
      {highlightLine && (
        <div
          style={{
            padding: "4px 12px",
            borderBottom: "1px solid #F26A3D33",
            borderLeft: "3px solid #F26A3D",
            background: "#FFF8F5",
            fontSize: 10,
            color: "#F26A3D",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Selected block → line {highlightLine}</span>
          <button
            onClick={() => useEditorStore.getState().setSelectedNodeId(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#F26A3D",
              padding: "0 2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Deselect block"
          >
            <X size={11} />
          </button>
        </div>
      )}

      {/* Code area */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {lines.length === 0 || (lines.length === 1 && lines[0] === "") ? (
          <div style={{ padding: "24px 16px", color: "#aaa9a4", fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>No code yet.</div>
            <div>Connect blocks from Start to End to generate Python.</div>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              lineHeight: "1.7",
            }}
          >
            <tbody>
              {lines.map((line, i) => {
                const lineNum = i + 1;
                const isHL = lineNum === highlightLine;
                return (
                  <tr
                    key={i}
                    style={{
                      background: isHL ? "#FFF8F5" : "transparent",
                    }}
                  >
                    {/* Line number */}
                    <td
                      style={{
                        textAlign: "right",
                        paddingRight: 12,
                        paddingLeft: 12,
                        color: isHL ? "#F26A3D" : "#D8D4CC",
                        userSelect: "none",
                        verticalAlign: "top",
                        width: 36,
                        fontWeight: isHL ? 700 : 400,
                        borderRight: isHL ? "2px solid #F26A3D" : "2px solid transparent",
                      }}
                    >
                      {lineNum}
                    </td>
                    {/* Code line */}
                    <td style={{ paddingLeft: 10, paddingRight: 12, whiteSpace: "pre", color: "#171717" }}>
                      {line === "" ? "\u00a0" : <HighlightedLine code={line} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </aside>
  );
}

function PanelBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#555555",
        borderRadius: 3,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F1EA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
    </button>
  );
}
