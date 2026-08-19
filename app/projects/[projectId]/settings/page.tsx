"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { ProjectSettingsView } from "@/components/visual-editor/projects/ProjectSettingsView";

export default function SettingsPage() {
  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : "";
  const { getProject } = useProjectsStore();
  const project = getProject(projectId);

  if (!project) return null;
  return <ProjectSettingsView project={project} />;
}
