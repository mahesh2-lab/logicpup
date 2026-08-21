import type { Metadata } from "next";
import ProjectClientLayout from "./layout.client";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  return {
    title: `Project ${p.projectId}`,
    description: `View project ${p.projectId} in LogicPup.`,
    alternates: {
      canonical: `/projects/${p.projectId}`,
    },
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <ProjectClientLayout>{children}</ProjectClientLayout>;
}

