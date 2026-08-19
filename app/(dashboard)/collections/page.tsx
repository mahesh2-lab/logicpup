"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderArchive,
  Plus,
  Trash2,
  FolderCode,
  Layers,
  ArrowRight,
  Folder,
} from "lucide-react";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { CreateCollectionModal } from "@/components/visual-editor/dashboard/CreateCollectionModal";
import { IconRenderer } from "@/components/visual-editor/components/IconRenderer";
import { useMounted } from "@/lib/useMounted";

export default function CollectionsPage() {
  const router = useRouter();
  const mounted = useMounted();
  const {
    projects,
    collections,
    createCollection,
    deleteCollection,
    setSelectedCollectionId,
  } = useProjectsStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const userCollections = mounted ? collections : [];

  function handleCreate(name: string, description: string, icon: string) {
    createCollection(name, description, icon);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Strip */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D4CC]">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive size={20} color="#F26A3D" />
            <h1 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              <span>Project Collections</span>
              {mounted ? (
                <span className="text-sm font-mono text-[#888]">({userCollections.length})</span>
              ) : (
                <span className="w-8 h-4 bg-[#E5E2DA] rounded animate-pulse inline-block" />
              )}
            </h1>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Organize your Python scripts into custom folders and categorized workspaces.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-[#F26A3D] hover:bg-[#E0592C] text-white text-xs font-bold uppercase rounded border-none cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus size={13} />
          <span>+ New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      {!mounted ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[#FFFFFF] border border-[#D8D4CC] p-5 rounded flex flex-col justify-between animate-pulse"
              style={{ minHeight: 140 }}
            >
              <div>
                <div className="w-8 h-8 rounded bg-[#E5E2DA] mb-2" />
                <div className="w-32 h-4 bg-[#E5E2DA] rounded mb-1" />
                <div className="w-full h-3 bg-[#E5E2DA] rounded" />
              </div>
              <div className="w-16 h-3 bg-[#E5E2DA] rounded mt-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {userCollections.map((col) => {
            const projsInCol = projects.filter((p) => col.projectIds.includes(p.id));

            return (
              <div
                key={col.id}
                onClick={() => {
                  setSelectedCollectionId(col.id);
                  router.push("/projects");
                }}
                className="bg-[#FFFFFF] border border-[#D8D4CC] p-5 rounded flex flex-col justify-between cursor-pointer hover:border-[#F26A3D] transition-colors relative group shadow-xs"
                style={{ minHeight: 140 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#FAF9F5] border border-[#D8D4CC] flex items-center justify-center text-[#F26A3D]">
                      <IconRenderer name={col.icon} size={18} />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete collection "${col.name}"?`)) {
                          deleteCollection(col.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-[#888] hover:text-[#C94A45] p-1"
                      title="Delete collection"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold uppercase mb-1">{col.name}</h3>
                  <p className="text-xs text-[#666666] line-clamp-2">
                    {col.description || "Organized project folder."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E5E2DA] mt-3">
                  <span className="text-[11px] font-mono text-[#888]">
                    {projsInCol.length} {projsInCol.length === 1 ? "project" : "projects"}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#F26A3D] uppercase">
                    <span>Open</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Collection Action Card */}
          <div
            onClick={() => setIsCreateOpen(true)}
            className="border-2 border-dashed border-[#D8D4CC] hover:border-[#F26A3D] p-5 rounded flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FAF9F5]/50 text-center"
            style={{ minHeight: 140 }}
          >
            <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#D8D4CC] flex items-center justify-center mb-2 text-[#888]">
              <Plus size={16} />
            </div>
            <span className="text-xs font-bold uppercase text-[#555]">Create Collection</span>
            <span className="text-[11px] text-[#888] mt-0.5">Group related projects together</span>
          </div>
        </div>
      )}

      <CreateCollectionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
