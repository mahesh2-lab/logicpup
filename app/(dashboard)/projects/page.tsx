"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderCode,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Copy,
  Archive,
  Trash2,
  RotateCcw,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";
import { useProjectsStore, PROJECT_TEMPLATES } from "@/components/visual-editor/projects/projectStore";
import type { ProjectStatus, Project } from "@/components/visual-editor/projects/types";
import { useMounted } from "@/lib/useMounted";

export default function ProjectsPage() {
  const router = useRouter();
  const mounted = useMounted();
  const {
    projects,
    collections,
    searchQuery,
    statusFilter,
    selectedCollectionId,
    setSearchQuery,
    setStatusFilter,
    setSelectedCollectionId,
    createProject,
    duplicateProject,
    archiveProject,
    restoreProject,
    deleteProject,
  } = useProjectsStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const activeProjects = mounted
    ? projects.filter((p) => {
        // Exclude learning challenges from user projects
        if (p.id === "challenge-sandbox" || Boolean(p.learningState?.challengeId)) {
          return false;
        }

        const matchesStatus =
          statusFilter === "all"
            ? p.status !== "archived"
            : p.status === statusFilter;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCollection =
          !selectedCollectionId ||
          collections.find((c) => c.id === selectedCollectionId)?.projectIds.includes(p.id);

        return matchesStatus && matchesSearch && matchesCollection;
      })
    : [];

  const archivedProjects = mounted
    ? projects.filter(
        (p) =>
          p.status === "archived" &&
          p.id !== "challenge-sandbox" &&
          !p.learningState?.challengeId
      )
    : [];
  const selectedCollection = mounted ? collections.find((c) => c.id === selectedCollectionId) : undefined;

  function formatTimeAgo(isoString: string) {
    if (!mounted) return "Recently";
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return "Just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return "Recently";
    }
  }

  function handleCreateBlank() {
    const newProj = createProject("empty", "My Python Project", "");
    router.push(`/projects/${newProj.id}/editor`);
  }

  return (
    <div
      className="max-w-6xl mx-auto space-y-6"
      onClick={() => setActiveMenuId(null)}
    >
      {/* Header Strip */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D4CC]">
        <div>
          <div className="flex items-center gap-2">
            <FolderCode size={20} color="#F26A3D" />
            <h1 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              <span>My Python Projects</span>
              {mounted ? (
                <span className="text-sm font-mono text-[#888]">({activeProjects.length})</span>
              ) : (
                <span className="w-8 h-4 bg-[#E5E2DA] rounded animate-pulse inline-block" />
              )}
            </h1>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Manage your visual block scripts, simulations, and algorithmic programs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateBlank}
            className="px-4 py-2 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold uppercase rounded border-none cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus size={13} />
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* Search, Filter Bar & Collection Badges */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#FFFFFF] border border-[#D8D4CC] rounded p-0.5 text-xs font-semibold">
            {(["all", "active", "completed", "archived"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded cursor-pointer border-none uppercase text-[11px] font-bold transition-colors ${
                  statusFilter === tab
                    ? "bg-[#171717] text-white"
                    : "bg-transparent text-[#666] hover:text-[#171717]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Collection Filter Pill */}
          {selectedCollection && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#F26A3D]/10 border border-[#F26A3D] text-[#F26A3D] rounded text-xs font-bold">
              <span>📁 {selectedCollection.name}</span>
              <button
                onClick={() => setSelectedCollectionId(null)}
                className="bg-transparent border-none cursor-pointer text-[#F26A3D] hover:text-[#C94A45] ml-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-[#888888] pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#D8D4CC] rounded focus:outline-none focus:border-[#F26A3D]"
            style={{ width: 260 }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {!mounted ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[#FFFFFF] border border-[#D8D4CC] rounded p-5 flex flex-col justify-between animate-pulse"
              style={{ minHeight: 170 }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-24 h-4 bg-[#E5E2DA] rounded" />
                  <div className="w-4 h-4 bg-[#E5E2DA] rounded" />
                </div>
                <div className="w-40 h-5 bg-[#E5E2DA] rounded mb-2" />
                <div className="w-full h-3 bg-[#E5E2DA] rounded mb-1" />
                <div className="w-2/3 h-3 bg-[#E5E2DA] rounded" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E5E2DA] mt-3">
                <div className="w-16 h-3 bg-[#E5E2DA] rounded" />
                <div className="w-16 h-6 bg-[#E5E2DA] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : activeProjects.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {activeProjects.map((project) => {
            const nodeCount = project.visualProgram?.nodes?.length || 0;
            const isMenuOpen = activeMenuId === project.id;

            return (
              <div
                key={project.id}
                className="bg-[#FFFFFF] border border-[#D8D4CC] rounded p-5 flex flex-col justify-between hover:border-[#F26A3D] transition-colors relative shadow-xs"
                style={{ minHeight: 170 }}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#FAF9F5] border border-[#D8D4CC] rounded text-[#555]">
                      {project.language} • {nodeCount} BLOCKS
                    </span>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : project.id);
                        }}
                        className="text-[#888] hover:text-[#171717] bg-transparent border-none cursor-pointer p-1 rounded"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-6 z-30 bg-[#FFFFFF] border border-[#D8D4CC] rounded shadow-lg py-1 w-36 text-xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateProject(project.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#FAF9F5] flex items-center gap-2 bg-transparent border-none cursor-pointer text-[#171717]"
                          >
                            <Copy size={12} />
                            <span>Duplicate</span>
                          </button>
                          {project.status === "archived" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                restoreProject(project.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#FAF9F5] flex items-center gap-2 bg-transparent border-none cursor-pointer text-[#171717]"
                            >
                              <RotateCcw size={12} />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                archiveProject(project.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#FAF9F5] flex items-center gap-2 bg-transparent border-none cursor-pointer text-[#171717]"
                            >
                              <Archive size={12} />
                              <span>Archive</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete project "${project.name}"?`)) {
                                deleteProject(project.id);
                              }
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#FAF9F5] flex items-center gap-2 bg-transparent border-none cursor-pointer text-[#C94A45]"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-sm font-bold uppercase mb-1 truncate">
                    {project.name}
                  </h2>
                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {project.description || "Visual Python program."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E5E2DA] mt-3">
                  <span className="text-[10px] font-mono text-[#888]">
                    {formatTimeAgo(project.updatedAt)}
                  </span>
                  <Link
                    href={`/projects/${project.id}/editor`}
                    className="px-3 py-1 bg-[#171717] hover:bg-[#F26A3D] text-white text-xs font-bold uppercase rounded no-underline flex items-center gap-1 transition-colors"
                  >
                    <Play size={11} />
                    <span>Open</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-12 text-center rounded">
          <Code2 size={28} className="mx-auto mb-3 text-[#888]" />
          <h3 className="text-sm font-bold uppercase mb-1">No Projects Found</h3>
          <p className="text-xs text-[#666] mb-4">
            {searchQuery
              ? `No projects match "${searchQuery}". Try a different keyword.`
              : "You don't have any projects in this view yet."}
          </p>
          <button
            onClick={handleCreateBlank}
            className="px-4 py-2 bg-[#F26A3D] text-white text-xs font-bold uppercase rounded border-none cursor-pointer"
          >
            + Create First Project
          </button>
        </div>
      )}
    </div>
  );
}
