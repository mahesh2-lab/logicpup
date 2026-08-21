"use client";

import React, { useState, useEffect } from "react";
import { MonitorPlay } from "lucide-react";
import Link from "next/link";

interface ReactFlowMobileWarningProps {
  children: React.ReactNode;
}

export function ReactFlowMobileWarning({ children }: ReactFlowMobileWarningProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkViewport();

    // Add resize listener
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return <div className="flex-1 w-full h-full bg-[#F4F1EA]" />;
  }

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 w-full h-full min-h-100 flex flex-col items-center justify-center p-6 bg-[#F4F1EA] text-[#171717] font-sans">
      <div className="max-w-md w-full bg-white border border-[#D8D4CC] p-8 rounded shadow-sm text-center">
        <MonitorPlay className="w-12 h-12 text-[#F26A3D] mx-auto mb-4" />
        <h2 className="text-lg font-bold uppercase mb-2">Desktop Required</h2>
        <p className="text-sm text-[#555555] mb-6 leading-relaxed">
          The visual block editor requires a larger screen. Node dragging and code execution layouts are not compatible with mobile devices. Please open this project on a laptop or desktop computer to continue.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full py-2.5 bg-[#171717] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors inline-block"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
