"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { ProjectHeader } from "@/components/visual-editor/projects/ProjectHeader";
import { BlockExplanationModal } from "@/components/visual-editor/components/BlockExplanationModal";
import { useEditorStore } from "@/components/visual-editor/state/editorStore";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : Array.isArray(params.projectId) ? params.projectId[0] : "";

  const { getProject, setActiveProjectId, hydrateFromDatabase } = useProjectsStore();
  const { loadProjectProgram, activeProjectId } = useEditorStore();

  useEffect(() => {
    hydrateFromDatabase();
  }, [hydrateFromDatabase]);

  const project = getProject(projectId);

  // Sync active project into editorStore when opening project
  useEffect(() => {
    if (project && activeProjectId !== project.id) {
      setActiveProjectId(project.id);
      loadProjectProgram(
        project.id,
        project.visualProgram.nodes,
        project.visualProgram.edges
      );
    }
  }, [project, activeProjectId, setActiveProjectId, loadProjectProgram]);

  if (!project) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: "#F4F1EA", color: "#171717", fontFamily: "var(--font-sans)" }}
      >
        <div
          className="bg-[#FFFFFF] border border-[#D8D4CC] p-8 text-center max-w-md w-full shadow-sm"
          style={{ borderRadius: 6 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#C94A45",
              marginBottom: 4,
            }}
          >
            PROJECT NOT FOUND
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            Unable to Load Workspace
          </h2>
          <p style={{ fontSize: 12, color: "#666666", marginBottom: 20, lineHeight: 1.4 }}>
            The requested project ID <code className="font-mono text-[#F26A3D]">{projectId}</code> does not exist or may have been deleted.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
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
            RETURN TO PROJECTS DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div
        className="flex flex-col h-screen overflow-hidden"
        style={{ background: "#F4F1EA", color: "#171717", fontFamily: "var(--font-sans)" }}
      >
        {/* Persistent Project Header */}
        <ProjectHeader project={project} />

        {/* Project View Content */}
        <div className="flex-1 flex overflow-hidden">{children}</div>

        {/* Global Block Explanation Modal */}
        <BlockExplanationModal />
      </div>
    </ReactFlowProvider>
  );
}
