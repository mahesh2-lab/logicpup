import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  const projectId = p.projectId;

  return {
    title: `Project ${projectId} Settings`,
    description: `Configure project ${projectId} preferences and management options in LogicPup.`,
    alternates: {
      canonical: `/projects/${projectId}/settings`,
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
