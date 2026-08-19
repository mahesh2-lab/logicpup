"use client";

import React from "react";

interface MiniLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export function MiniLoader({ label = "Loading workspace…", fullScreen = false }: MiniLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Editorial geometric mini spinner */}
      <div className="relative w-6 h-6">
        <div
          className="w-6 h-6 rounded-sm border-2 border-[#D8D4CC] border-t-[#F26A3D] animate-spin"
          style={{ animationDuration: "600ms" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#171717] rounded-xs" />
        </div>
      </div>

      {/* Label */}
      {label && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#666666",
            fontFamily: "var(--font-mono)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "#F4F1EA", color: "#171717" }}
      >
        {content}
      </div>
    );
  }

  return <div className="flex-1 w-full h-full flex items-center justify-center p-8">{content}</div>;
}
