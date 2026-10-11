import type { Metadata } from "next";
import ProjectClientLayout from "./layout.client";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  return {
    title: `Project ${p.projectId}`,
    description: `Open LogicPup project ${p.projectId} and continue building Python logic visually.`,
    alternates: {
      canonical: `/projects/${p.projectId}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <ProjectClientLayout>{children}</ProjectClientLayout>;
}
