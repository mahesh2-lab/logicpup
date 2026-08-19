"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";
import { ProjectOverviewView } from "@/components/visual-editor/projects/ProjectOverviewView";

export default function OverviewPage() {
  const params = useParams();
  const projectId = typeof params.projectId === "string" ? params.projectId : "";
  const { getProject } = useProjectsStore();
  const project = getProject(projectId);

  if (!project) return null;
  return <ProjectOverviewView project={project} />;
}
