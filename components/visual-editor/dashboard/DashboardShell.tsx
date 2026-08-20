"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Trophy,
  FolderCode,
  FolderArchive,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Plus,
  Search,
  WifiOff,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useProjectsStore } from "../projects/projectStore";
import { UserAuthMenu } from "../components/UserAuthMenu";
import { CreateProjectModal } from "./CreateProjectModal";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { useMounted } from "@/lib/useMounted";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const {
    projects,
    collections,
    completedChallengeIds,
    searchQuery,
    setSearchQuery,
    createProject,
    createCollection,
    hydrateFromDatabase,
    syncState,
    offlineQueue,
    isOnline,
    setOnlineStatus,
    flushOfflineQueue,
  } = useProjectsStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);

  React.useEffect(() => {
    hydrateFromDatabase();

    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [hydrateFromDatabase, setOnlineStatus]);

  const activeProjectsCount = mounted
    ? projects.filter(
        (p) =>
          p.status !== "archived" &&
          p.id !== "challenge-sandbox" &&
          !p.learningState?.challengeId
      ).length
    : 0;
  const solvedCount = mounted ? completedChallengeIds.length : 0;
  const collectionsCount = mounted ? collections.length : 0;

  function handleCreateProject(templateId: string, name: string, description: string) {
    const newProj = createProject(templateId, name, description);
    router.push(`/projects/${newProj.id}/editor`);
  }

  function handleCreateCollection(name: string, description: string, icon: string) {
    createCollection(name, description, icon);
  }

  const sidebarNavItems = [
    {
      href: "/dashboard",
      label: "Home",
      icon: <Home size={15} />,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/dashboard/learn",
      label: "Learn & Levels",
      icon: <Trophy size={15} />,
      badge: mounted ? `${solvedCount} Solved` : undefined,
      isActive: pathname.startsWith("/dashboard/learn"),
    },
    {
      href: "/dashboard/projects",
      label: "My Projects",
      icon: <FolderCode size={15} />,
      count: mounted ? String(activeProjectsCount) : undefined,
      isActive: pathname === "/dashboard/projects" || pathname.startsWith("/dashboard/projects/"),
    },
    {
      href: "/dashboard/collections",
      label: "Collections",
      icon: <FolderArchive size={15} />,
      count: mounted ? String(collectionsCount) : undefined,
      isActive: pathname.startsWith("/dashboard/collections"),
    },
    {
      href: "/dashboard/tutorials",
      label: "Tutorials & Docs",
      icon: <BookOpen size={15} />,
      isActive: pathname.startsWith("/dashboard/tutorials"),
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#F4F1EA] text-[#171717] font-sans">
      {/* ── Top Global Navbar ── */}
      <header className="flex items-center justify-between px-6 h-12 border-b border-[#D8D4CC] bg-white shrink-0">
        {/* Left: Brand + Breadcrumbs */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 no-underline text-[#171717]">
            <div className="w-6 h-6 bg-[#F26A3D] text-white flex items-center justify-center font-bold text-xs rounded">
              TF
            </div>
            <span className="text-sm font-bold tracking-[-0.01em] uppercase">
              TEACHFLOW
            </span>
          </Link>

          {/* Quick Breadcrumbs */}
          <div className="flex items-center gap-4 text-xs font-mono text-[#888888]">
            <span>/</span>
            <Link
              href="/dashboard"
              className={`hover:text-[#F26A3D] transition-colors no-underline ${
                pathname === "/dashboard" ? "text-[#F26A3D] font-bold" : "text-[#888888]"
              }`}
            >
              DASHBOARD
            </Link>
            <Link
              href="/dashboard/learn"
              className={`hover:text-[#F26A3D] transition-colors no-underline ${
                pathname.startsWith("/dashboard/learn") ? "text-[#F26A3D] font-bold" : "text-[#888888]"
              }`}
            >
              LEARN & LEVELS
            </Link>
            <Link
              href="/dashboard/projects"
              className={`hover:text-[#F26A3D] transition-colors no-underline ${
                pathname === "/dashboard/projects" ? "text-[#F26A3D] font-bold" : "text-[#888888]"
              }`}
            >
              PROJECTS
            </Link>
            <Link
              href="/dashboard/collections"
              className={`hover:text-[#F26A3D] transition-colors no-underline ${
                pathname.startsWith("/dashboard/collections") ? "text-[#F26A3D] font-bold" : "text-[#888888]"
              }`}
            >
              COLLECTIONS
            </Link>
          </div>
        </div>

        {/* Right: Sync Status, Search, New Project, User Menu */}
        <div className="flex items-center gap-3">
          {/* Network & Sync Status Badge */}
         

          {/* Quick Search */}
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-2.5 text-[#888888] pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (pathname !== "/dashboard/projects" && e.target.value.trim().length > 0) {
                  router.push("/dashboard/projects");
                }
              }}
              className="pl-8 pr-3 py-1 text-xs bg-[#FAF9F5] border border-[#D8D4CC] rounded focus:outline-none focus:border-[#F26A3D] transition-colors w-[190px]"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsCreateProjectOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold uppercase tracking-wider rounded border-none cursor-pointer transition-colors"
          >
            <Plus size={13} />
            <span>NEW PROJECT</span>
          </button>

          <UserAuthMenu />
        </div>
      </header>

      {/* ── Main Body: Left Sidebar + Page Content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar Navigation ── */}
        <aside
          className="border-r border-[#D8D4CC] bg-white flex flex-col justify-between py-4 shrink-0 transition-[width] duration-180 ease-out"
          style={{ width: sidebarCollapsed ? 64 : 220 }}
        >
          {/* Navigation Links */}
          <div className="space-y-1 px-2">
            <div className="px-3 pb-2 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
              {!sidebarCollapsed && "WORKSPACE"}
            </div>

            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded cursor-pointer transition-colors no-underline ${
                  item.isActive
                    ? "bg-[#F4F1EA] text-[#F26A3D] font-bold border-l-3 border-[#F26A3D]"
                    : "text-[#555555] hover:bg-[#FAF9F5] hover:text-[#171717]"
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <span className={item.isActive ? "text-[#F26A3D]" : "text-[#888888]"}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!sidebarCollapsed && (
                  <>
                    {item.count && (
                      <span className="text-[10px] font-mono bg-[#E5E2DA] px-1.5 py-0.2 rounded text-[#555]">
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-[#F26A3D]/10 text-[#F26A3D] px-1.5 py-0.2 rounded">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* Bottom Help & Collapse Button */}
          <div className="px-3 pt-3 border-t border-[#E5E2DA] flex items-center justify-between">
            <Link
              href="/dashboard/tutorials"
              className="flex items-center gap-2 text-xs font-semibold text-[#555555] no-underline hover:text-[#171717]"
              title="Help & Tutorials"
            >
              <HelpCircle size={15} color="#888888" />
              {!sidebarCollapsed && <span>Help & Docs</span>}
            </Link>

            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-[#888888] hover:text-[#171717] bg-transparent border-none cursor-pointer p-1 rounded"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight
                size={14}
                className={sidebarCollapsed ? "" : "rotate-180"}
              />
            </button>
          </div>
        </aside>

        {/* ── Page Content Container ── */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />

      <CreateCollectionModal
        isOpen={isCreateCollectionOpen}
        onClose={() => setIsCreateCollectionOpen(false)}
        onCreate={handleCreateCollection}
      />
    </div>
  );
}
