"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditorStore } from "../state/editorStore";
import { Terminal, CornerDownLeft, X } from "lucide-react";

export function InputDialog() {
  const { pendingInput, submitInputPrompt } = useEditorStore();
  const [val, setVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pendingInput) {
      setVal("");
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(t);
    }
  }, [pendingInput]);

  if (!pendingInput) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitInputPrompt(val.trim());
  }

  function handleCancel() {
    submitInputPrompt("");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(23, 23, 23, 0.45)",
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#FFFFFF",
          border: "1.5px solid #171717",
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          borderRadius: 8,
          overflow: "hidden",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "#F4F1EA",
            borderBottom: "1px solid #D8D4CC",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "#F26A3D",
                padding: "2px 7px",
                borderRadius: 3,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Terminal size={11} /> Program Input
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                color: "#555555",
                fontFamily: "var(--font-mono)",
              }}
            >
              saving to: <strong style={{ color: "#171717" }}>{pendingInput.variableName}</strong>
            </span>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
              }}
              title="Skip / Cancel"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Dialog Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 20px 18px" }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              fontWeight: 700,
              color: "#171717",
              marginBottom: 12,
              letterSpacing: "-0.01em",
            }}
          >
            {pendingInput.promptText || `What is the value for ${pendingInput.variableName}?`}
          </label>

          <div style={{ position: "relative", marginBottom: 18 }}>
            <input
              ref={inputRef}
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Type your answer here..."
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: 15,
                fontFamily: "var(--font-sans)",
                color: "#171717",
                background: "#FAFAFA",
                border: "1.5px solid #171717",
                borderRadius: 6,
                outline: "none",
                boxShadow: "0 0 0 3px rgba(242, 106, 61, 0.15)",
              }}
            />
          </div>

          {/* Action Button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "#171717",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                transition: "background 120ms",
              }}
            >
              Continue <CornerDownLeft size={13} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
