import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "#F4F1EA", color: "#171717", fontFamily: "var(--font-sans)" }}
    >
      <div
        className="bg-[#FFFFFF] border border-[#D8D4CC] p-8 text-center max-w-md w-full shadow-sm"
        style={{ borderRadius: 6 }}
      >
        <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#D8D4CC] flex items-center justify-center mx-auto mb-4 text-[#F26A3D]">
          <Compass size={24} />
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
          404 — PAGE NOT FOUND
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
          Lost in the Flow?
        </h1>

        <p style={{ fontSize: 13, color: "#666666", marginBottom: 24, lineHeight: 1.5 }}>
          The page or workspace you requested does not exist or may have been moved.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "#171717",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          <ArrowLeft size={14} />
          RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
