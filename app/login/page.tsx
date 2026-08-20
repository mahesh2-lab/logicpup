"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { MiniLoader } from "@/components/visual-editor/components/MiniLoader";

export default function LoginPage() {
  return (
    <Suspense fallback={<MiniLoader fullScreen label="Loading CodeFlow…" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup" || urlMode === "signin") {
      setMode(urlMode);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }

        const res = await signUp.email({
          email,
          password,
          name: name.trim(),
        });

        if (res.error) {
          setError(res.error.message || "Failed to create account.");
        } else {
          setSuccessMsg("Account created! Redirecting...");
          setTimeout(() => {
            router.push(callbackUrl);
            router.refresh();
          }, 800);
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        });

        if (res.error) {
          setError(res.error.message || "Invalid email or password.");
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "#F4F1EA", color: "#171717", fontFamily: "var(--font-sans)" }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-[#F26A3D] text-white flex items-center justify-center font-bold text-sm rounded">
          CF
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#171717" }}>
          CODEFLOW
        </span>
      </div>

      {/* Main Auth Card */}
      <div
        className="w-full max-w-md bg-[#FFFFFF] border border-[#D8D4CC] shadow-lg overflow-hidden"
        style={{ borderRadius: 6 }}
      >
        {/* Card Top Strip */}
        <div className="p-6 border-b border-[#E5E2DA] bg-[#FBFCFF]">
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#555555",
            }}
          >
            {mode === "signin" ? "AUTHENTICATION" : "NEW ACCOUNT"}
          </span>
          <h1 style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", marginTop: 2 }}>
            {mode === "signin" ? "Sign In to CodeFlow" : "Create Developer Account"}
          </h1>
          <p style={{ fontSize: 12, color: "#666666", marginTop: 2 }}>
            {mode === "signin"
              ? "Access your visual programming projects and saved workspaces."
              : "Start building Python programs with interactive visual blocks."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#C94A45]/10 border border-[#C94A45]/30 rounded text-xs text-[#C94A45] flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#287A52]/10 border border-[#287A52]/30 rounded text-xs text-[#287A52] flex items-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555] mb-1">
                FULL NAME
              </label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-3 text-[#888]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Turing"
                  required
                  suppressHydrationWarning
                  className="w-full pl-8 pr-3 py-2 text-xs border border-[#D8D4CC] rounded outline-none font-sans bg-[#FBFCFF] focus:border-[#F26A3D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555] mb-1">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-3 text-[#888]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                required
                suppressHydrationWarning
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#D8D4CC] rounded outline-none font-sans bg-[#FBFCFF] focus:border-[#F26A3D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555] mb-1">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <Lock size={13} className="absolute left-3 text-[#888] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                suppressHydrationWarning
                className="w-full pl-8 pr-9 py-2 text-xs border border-[#D8D4CC] rounded outline-none font-sans bg-[#FBFCFF] focus:border-[#F26A3D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 p-1 text-[#888] hover:text-[#171717] bg-transparent border-none cursor-pointer flex items-center justify-center transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {mode === "signup" && (
              <span className="text-[10px] text-[#888] font-mono mt-1 block">
                Must be at least 8 characters.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: "100%",
              padding: "10px",
              background: "#F26A3D",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 18,
            }}
          >
            {loading ? (
              <span>PROCESSING…</span>
            ) : mode === "signin" ? (
              <>
                <span>SIGN IN</span>
                <ArrowRight size={13} />
              </>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        {/* Card Footer Tab Switcher */}
        <div className="p-4 border-t border-[#E5E2DA] bg-[#F4F1EA] text-center text-xs">
          {mode === "signin" ? (
            <span className="text-[#555]">
              Don't have an account yet?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="font-bold text-[#F26A3D] bg-transparent border-none cursor-pointer underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span className="text-[#555]">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className="font-bold text-[#F26A3D] bg-transparent border-none cursor-pointer underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
