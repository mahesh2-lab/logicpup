"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { ProjectRunsView } from "@/components/visual-editor/projects/ProjectRunsView";

export default function RunsPage() {
  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : "";
  const { getProject } = useProjectsStore();
  const project = getProject(projectId);

  if (!project) return null;
  return <ProjectRunsView project={project} />;
}
