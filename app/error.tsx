"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import posthog from "posthog-js";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "#F4F1EA", color: "#171717", fontFamily: "var(--font-sans)" }}
    >
      <div
        className="bg-[#FFFFFF] border border-[#D8D4CC] p-8 text-center max-w-md w-full shadow-sm"
        style={{ borderRadius: 6 }}
      >
        <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#D8D4CC] flex items-center justify-center mx-auto mb-4 text-[#C94A45]">
          <AlertTriangle size={24} />
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#C94A45",
          }}
        >
          APPLICATION ERROR
        </span>

        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            textTransform: "uppercase",
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          Something Went Wrong
        </h1>

        <p style={{ fontSize: 13, color: "#666666", marginBottom: 24, lineHeight: 1.5 }}>
          {error.message || "An unexpected error occurred while rendering this page."}
        </p>

        <button
          onClick={() => reset()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "#F26A3D",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
