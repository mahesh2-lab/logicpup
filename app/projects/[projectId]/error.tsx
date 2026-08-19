"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Project workspace error:", error);
  }, [error]);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8"
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
          WORKSPACE ERROR
        </span>

        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            textTransform: "uppercase",
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          Error Loading Workspace
        </h2>

        <p style={{ fontSize: 12, color: "#666666", marginBottom: 20, lineHeight: 1.4 }}>
          {error.message || "An error occurred while loading this project."}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
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
            <RotateCcw size={13} />
            RETRY
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background: "#FAF9F5",
              color: "#171717",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              border: "1px solid #D8D4CC",
              borderRadius: 4,
            }}
          >
            <ArrowLeft size={13} />
            DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
}
