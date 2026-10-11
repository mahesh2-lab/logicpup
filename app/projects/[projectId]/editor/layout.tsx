import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  const projectId = p.projectId;

  return {
    title: `Project ${projectId} Editor`,
    description: `Edit project ${projectId} in the LogicPup visual Python flowchart editor.`,
    alternates: {
      canonical: `/projects/${projectId}/editor`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
