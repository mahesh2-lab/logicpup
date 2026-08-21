"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { MiniLoader } from "@/components/visual-editor/components/MiniLoader";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function LoginPage() {
  return (
    <Suspense fallback={<MiniLoader fullScreen label="Fetching LogicPup treats… 🐾" />}>
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
          setSuccessMsg("Welcome to the pack! Redirecting... 🐾");
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
        <BrandLogo size="md" href="" />
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
            {mode === "signin" ? "AUTHENTICATION" : "JOIN THE PACK"}
          </span>
          <h1 className="text-lg font-bold uppercase mt-1 text-[#171717]">
            {mode === "signin" ? "Sign In to LogicPup 🐾" : "Create LogicPup Account"}
          </h1>
          <p style={{ fontSize: 12, color: "#666666", marginTop: 2 }}>
            {mode === "signin"
              ? "Access your visual Python projects and saved workspaces."
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

          <div className="flex items-center gap-2 my-2 w-full justify-center">
            <hr className="w-full border-[#E5E2DA]" />
            <span className="text-[10px] text-[#888] font-mono font-bold uppercase shrink-0">OR</span>
            <hr className="w-full border-[#E5E2DA]" />
          </div>

          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              await signIn.social({
                provider: "google",
                callbackURL: callbackUrl,
              });
            }}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: "100%",
              padding: "10px",
              background: "#FFFFFF",
              color: "#171717",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "1px solid #D8D4CC",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
            className="hover:bg-[#F4F1EA] transition-colors"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
          </button>
          
          <p className="text-[10px] text-center text-[#888] mt-4">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-[#171717]">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-[#171717]">Privacy Policy</a>.
          </p>
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
