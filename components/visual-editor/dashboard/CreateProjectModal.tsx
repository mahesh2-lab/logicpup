"use client";

import React, { useState } from "react";
import { X, ArrowRight, Code2 } from "lucide-react";
import { PROJECT_TEMPLATES, useProjectsStore } from "../projects/projectStore";
import { DynamicIcon } from "../components/IconRenderer";
import { useRouter } from "next/navigation";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const router = useRouter();
  const { createProject } = useProjectsStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("empty");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const template = PROJECT_TEMPLATES.find((t) => t.id === selectedTemplate);
    const projectName = name.trim() || template?.name || "New Python Project";
    const projectDesc = description.trim() || template?.description || "";

    const newProject = createProject(selectedTemplate, projectName, projectDesc);
    onClose();
    router.push(`/projects/${newProject.id}/editor`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(23, 23, 23, 0.5)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#D8D4CC] shadow-2xl overflow-hidden"
        style={{ borderRadius: 6, fontFamily: "var(--font-sans)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #D8D4CC",
            background: "#F4F1EA",
          }}
        >
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#555555",
              }}
            >
              CREATE PROJECT
            </span>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#171717", marginTop: 2 }}>
              Initialize Workspace
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #D8D4CC",
              borderRadius: 4,
              padding: 4,
              cursor: "pointer",
              color: "#555555",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {/* Project Name */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#555555",
                marginBottom: 6,
              }}
            >
              PROJECT NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Number Guessing Game"
              autoFocus
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                color: "#171717",
                background: "#FBFCFF",
                border: "1px solid #D8D4CC",
                borderRadius: 4,
                outline: "none",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#555555",
                marginBottom: 6,
              }}
            >
              DESCRIPTION (OPTIONAL)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this project builds..."
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                color: "#171717",
                background: "#FBFCFF",
                border: "1px solid #D8D4CC",
                borderRadius: 4,
                outline: "none",
              }}
            />
          </div>

          {/* Language Selection */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#555555",
                marginBottom: 6,
              }}
            >
              LANGUAGE
            </label>
            <div className="flex gap-2">
              <div
                style={{
                  padding: "6px 14px",
                  background: "#F4F1EA",
                  border: "1.5px solid #F26A3D",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#171717",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Code2 size={13} color="#F26A3D" />
                <span>Python</span>
                <span className="text-[10px] bg-[#F26A3D] text-white px-1.5 py-0.2 rounded">DEFAULT</span>
              </div>
            </div>
          </div>

          {/* Starter Template Selection */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#555555",
                marginBottom: 8,
              }}
            >
              PROJECT TEMPLATE
            </label>
            <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {PROJECT_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    style={{
                      padding: "10px 12px",
                      background: isSelected ? "#FFF8F5" : "#FBFCFF",
                      border: isSelected ? "2px solid #F26A3D" : "1px solid #D8D4CC",
                      borderRadius: 4,
                      cursor: "pointer",
                      transition: "border-color 100ms ease",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 700, color: "#171717" }}>
                        <DynamicIcon name={tmpl.icon} size={14} color={isSelected ? "#F26A3D" : "#171717"} />
                        <span>{tmpl.name}</span>
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1 py-0.2 border border-[#D8D4CC] text-[#555]">
                        {tmpl.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "#666666", lineHeight: 1.3 }} className="line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              paddingTop: 16,
              borderTop: "1px solid #E5E2DA",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "1px solid #D8D4CC",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#555555",
                cursor: "pointer",
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 18px",
                background: "#F26A3D",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              CREATE PROJECT <ArrowRight size={13} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
