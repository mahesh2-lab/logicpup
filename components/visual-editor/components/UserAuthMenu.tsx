"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, LogOut, LogIn, ChevronDown, Settings } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export function UserAuthMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setIsOpen(false);
    router.push("/login");
    router.refresh();
  }

  if (isPending) {
    return <div className="w-7 h-7 rounded-full bg-[#E5E2DA] animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 10px",
          background: "#FFFFFF",
          border: "1px solid #D8D4CC",
          borderRadius: 4,
          color: "#171717",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        <LogIn size={12} />
        <span>SIGN IN</span>
      </Link>
    );
  }

  const user = session.user;
  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          background: "#FF9D3C",
          border: "1px solid #D8D4CC",
          borderRadius: 50,
          cursor: "pointer",
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: 600,
          userSelect: "none",
        }}
      >

        {user.image ? (
          <Image src={user.image} alt={user.name ? `${user.name}'s profile picture` : "User profile picture"} width={32} height={32} className="w-full h-full object-cover" style={{ borderRadius: 50 }} />
        ) : (
          initial
        )}
        {/* <span style={{ fontSize: 11, fontWeight: 700, maxWidth: 100 }} className="truncate">
          {user.name || user.email}
        </span> */}
        {/* <ChevronDown size={11} color="#888" /> */}
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-9 bg-[#FFFFFF] border border-[#D8D4CC] shadow-xl z-50 py-1"
          style={{ borderRadius: 4, minWidth: 160, fontFamily: "var(--font-sans)" }}
        >
          <div className="px-3 py-2 border-b border-[#E5E2DA] text-xs">
            <div className="font-bold text-[#171717] truncate">{user.name || "Developer"}</div>
            <div className="text-[10px] text-[#888888] truncate font-mono">{user.email}</div>
          </div>

          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 text-left text-xs hover:bg-[#FAF9F5] text-[#171717] flex items-center gap-2 font-bold cursor-pointer border-none bg-transparent no-underline"
          >
            <Settings size={12} />
            <span>SETTINGS</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 text-left text-xs hover:bg-[#C94A45]/10 text-[#C94A45] flex items-center gap-2 font-bold cursor-pointer border-none bg-transparent"
          >
            <LogOut size={12} />
            <span>SIGN OUT</span>
          </button>
        </div>
      )}
    </div>
  );
}
