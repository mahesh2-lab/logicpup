"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { Copy, Download, Archive, RotateCcw, Trash2, Check } from "lucide-react";
import { useProjectsStore } from "./projectStore";
import type { Project } from "./types";

interface ProjectSettingsViewProps {
  project: Project;
}

export function ProjectSettingsView({ project }: ProjectSettingsViewProps) {
  const router = useRouter();
  const { updateProject, duplicateProject, archiveProject, restoreProject, deleteProject } = useProjectsStore();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [savedFeedback, setSavedFeedback] = useState(false);

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    updateProject(project.id, {
      name: name.trim() || project.name,
      description: description.trim(),
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  }

  function handleExportJson() {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "_")}.teachflow.json`;
    a.click();
    URL.revokeObjectURL(url);
    posthog.capture("project_exported", {
      export_format: "json",
    });
  }

  function handleExportPython() {
    const mainFile = project.files.find((f) => f.isMain || f.path === "main.py");
    const content = mainFile?.content || "# Empty program";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, "_")}.py`;
    a.click();
    URL.revokeObjectURL(url);
    posthog.capture("project_exported", {
      export_format: "python",
    });
  }

  function handleDuplicate() {
    const copy = duplicateProject(project.id);
    if (copy) {
      posthog.capture("project_duplicated", {
        source_project_id: project.id,
        project_id: copy.id,
      });
      router.push(`/projects/${copy.id}/overview`);
    }
  }

  function handleArchiveToggle() {
    if (project.status === "archived") {
      restoreProject(project.id);
      posthog.capture("project_restored", {
        project_id: project.id,
      });
    } else {
      archiveProject(project.id);
      posthog.capture("project_archived", {
        project_id: project.id,
      });
    }
  }

  function handleDelete() {
    if (confirm(`Are you sure you want to permanently delete "${project.name}"? This action cannot be undone.`)) {
      deleteProject(project.id);
      posthog.capture("project_deleted", {
        project_id: project.id,
      });
      router.push("/dashboard/projects");
    }
  }

  return (
    <div
      className="flex-1 overflow-auto p-8 max-w-3xl mx-auto w-full"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      <div className="pb-4 border-b border-[#D8D4CC] mb-6">
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#555555",
          }}
        >
          PROJECT CONFIGURATION
        </span>
        <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: "uppercase", marginTop: 2 }}>
          Settings for {project.name}
        </h2>
      </div>

      {/* General Settings Card */}
      <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 mb-6 rounded">
        <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", marginBottom: 16 }}>
          General Details
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555] mb-1">
              PROJECT NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 text-xs border border-[#D8D4CC] rounded outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555] mb-1">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 text-xs border border-[#D8D4CC] rounded outline-none font-sans resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 14px",
                background: savedFeedback ? "#287A52" : "#171717",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {savedFeedback ? <Check size={12} /> : null}
              <span>{savedFeedback ? "SAVED" : "SAVE CHANGES"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Export & Duplication Card */}
      <div className="bg-[#FFFFFF] border border-[#D8D4CC] p-6 mb-6 rounded">
        <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>
          Export & Duplication
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 text-xs">
          <button
            onClick={handleExportPython}
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 border border-[#D8D4CC] rounded hover:bg-[#F4F1EA] font-bold w-full sm:w-auto"
          >
            <Download size={13} className="shrink-0" /> Export Python (.py)
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 border border-[#D8D4CC] rounded hover:bg-[#F4F1EA] font-bold w-full sm:w-auto"
          >
            <Download size={13} className="shrink-0" /> Export Project (.json)
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 border border-[#D8D4CC] rounded hover:bg-[#F4F1EA] font-bold w-full sm:w-auto"
          >
            <Copy size={13} className="shrink-0" /> Duplicate Project
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#FFFFFF] border border-[#C94A45]/40 p-6 rounded">
        <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#C94A45", marginBottom: 14 }}>
          Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#E5E2DA] text-xs gap-3 sm:gap-0">
          <div>
            <div className="font-bold text-[#171717]">
              {project.status === "archived" ? "Restore Project" : "Archive Project"}
            </div>
            <div className="text-[11px] text-[#666]">
              {project.status === "archived"
                ? "Move project back to active dashboard."
                : "Archive project. It will remain readable but hidden from active lists."}
            </div>
          </div>
          <button
            onClick={handleArchiveToggle}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 border border-[#D8D4CC] rounded text-[11px] font-bold uppercase hover:bg-[#F4F1EA] w-full sm:w-auto shrink-0"
          >
            {project.status === "archived" ? <RotateCcw size={12} /> : <Archive size={12} />}
            <span>{project.status === "archived" ? "Restore" : "Archive"}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 pb-1 text-xs gap-3 sm:gap-0">
          <div>
            <div className="font-bold text-[#C94A45]">Delete Project Permanently</div>
            <div className="text-[11px] text-[#666]">
              Permanently remove this project, all files, visual blocks, and execution runs.
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-[#C94A45] text-white rounded text-[11px] font-bold uppercase hover:bg-[#A33818] w-full sm:w-auto shrink-0"
          >
            <Trash2 size={12} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
