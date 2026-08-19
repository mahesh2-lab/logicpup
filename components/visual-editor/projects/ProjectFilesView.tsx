"use client";

import React, { useState } from "react";
import { Plus, FileCode, FileText, Trash2, Save, Check } from "lucide-react";
import { useProjectsStore } from "./projectStore";
import type { Project } from "./types";

interface ProjectFilesViewProps {
  project: Project;
}

export function ProjectFilesView({ project }: ProjectFilesViewProps) {
  const { updateFileContent, addFile, deleteFile } = useProjectsStore();

  const [selectedFileId, setSelectedFileId] = useState<string>(
    project.files[0]?.id || ""
  );
  const [newFilePath, setNewFilePath] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const activeFile = project.files.find((f) => f.id === selectedFileId) || project.files[0];
  const [fileContent, setFileContent] = useState(activeFile?.content || "");

  // Sync content when active file changes
  function handleSelectFile(id: string) {
    setSelectedFileId(id);
    const file = project.files.find((f) => f.id === id);
    if (file) setFileContent(file.content);
  }

  function handleSaveFile() {
    if (!activeFile) return;
    updateFileContent(project.id, activeFile.id, fileContent);
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2000);
  }

  function handleCreateFile(e: React.FormEvent) {
    e.preventDefault();
    if (!newFilePath.trim()) return;
    addFile(project.id, newFilePath.trim(), "# New file\n");
    setNewFilePath("");
    setIsAddingFile(false);
  }

  return (
    <div
      className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full p-6 gap-6"
      style={{ fontFamily: "var(--font-sans)", color: "#171717" }}
    >
      {/* File Tree Left Sidebar */}
      <div
        className="w-64 bg-[#FFFFFF] border border-[#D8D4CC] flex flex-col shrink-0"
        style={{ borderRadius: 6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#E5E2DA]">
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#171717" }}>
            FILES ({project.files.length})
          </span>
          <button
            onClick={() => setIsAddingFile(true)}
            style={{
              background: "#F4F1EA",
              border: "1px solid #D8D4CC",
              borderRadius: 3,
              padding: "2px 6px",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Plus size={11} /> NEW
          </button>
        </div>

        {/* Add File Input */}
        {isAddingFile && (
          <form onSubmit={handleCreateFile} className="p-2 border-b border-[#E5E2DA] bg-[#FBFCFF]">
            <input
              type="text"
              value={newFilePath}
              onChange={(e) => setNewFilePath(e.target.value)}
              placeholder="e.g. helper.py"
              autoFocus
              className="w-full text-xs font-mono p-1.5 border border-[#F26A3D] rounded outline-none"
            />
            <div className="flex justify-end gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => setIsAddingFile(false)}
                className="text-[10px] px-2 py-0.5 border border-[#D8D4CC] rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-[10px] px-2 py-0.5 bg-[#F26A3D] text-white rounded font-bold"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* File List */}
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {project.files.map((file) => {
            const isSelected = file.id === activeFile?.id;
            return (
              <div
                key={file.id}
                onClick={() => handleSelectFile(file.id)}
                className={`flex items-center justify-between p-2 rounded text-xs font-mono cursor-pointer transition-colors ${
                  isSelected ? "bg-[#FFF8F5] border border-[#F26A3D]" : "hover:bg-[#F4F1EA] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {file.name.endsWith(".py") ? (
                    <FileCode size={13} color="#356A9A" />
                  ) : (
                    <FileText size={13} color="#888888" />
                  )}
                  <span className="truncate">{file.path}</span>
                </div>

                {!file.isMain && project.files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete file "${file.path}"?`)) {
                        deleteFile(project.id, file.id);
                      }
                    }}
                    className="text-[#888] hover:text-[#C94A45] p-0.5 opacity-60 hover:opacity-100"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* File Editor Area */}
      <div
        className="flex-1 bg-[#FFFFFF] border border-[#D8D4CC] flex flex-col overflow-hidden"
        style={{ borderRadius: 6 }}
      >
        {activeFile ? (
          <>
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 h-10 border-b border-[#E5E2DA] bg-[#FBFCFF]">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="font-bold text-[#171717]">{activeFile.path}</span>
                {activeFile.isMain && (
                  <span className="text-[9px] bg-[#F4F1EA] border border-[#D8D4CC] px-1.5 py-0.2 rounded uppercase text-[#555]">
                    GENERATED BY BLOCKS
                  </span>
                )}
              </div>

              <button
                onClick={handleSaveFile}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  background: hasSaved ? "#287A52" : "#171717",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 3,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {hasSaved ? <Check size={12} /> : <Save size={12} />}
                <span>{hasSaved ? "SAVED" : "SAVE FILE"}</span>
              </button>
            </div>

            {/* Code Textarea */}
            <div className="flex-1 relative font-mono text-xs">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                    e.preventDefault();
                    handleSaveFile();
                  }
                }}
                className="w-full h-full p-4 outline-none resize-none font-mono text-xs leading-relaxed text-[#171717] bg-[#FFFFFF]"
                spellCheck={false}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#888888]">
            Select or create a file to inspect.
          </div>
        )}
      </div>
    </div>
  );
}
